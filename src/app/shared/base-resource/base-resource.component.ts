import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {BaseRepository} from '../services/base.repository';
import {SelectionModel} from '@angular/cdk/collections';
import {FormGroup} from '@angular/forms';
import {ComponentType} from '@angular/cdk/overlay';
import {merge} from 'rxjs';
import {flow} from '../stream/stream';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {NzModalService, NzModalRef} from 'ng-zorro-antd/modal';
import {NzPaginationComponent} from 'ng-zorro-antd/pagination';

export interface EditDialogData<MODEL extends {id?: number}> {
  mode: string;
  record: MODEL;
}

@Component({
  selector: 'app-base-resource',
  template: ``
})
export abstract class BaseResourceComponent<MODEL extends {id?: number}, EDIT_DIALOG>
  implements AfterViewInit {
  protected constructor(protected baseRepository: BaseRepository<MODEL>,
                        protected modal: NzModalService) {
  }
  data: MODEL[] = [];
  selection = new SelectionModel<MODEL>(true, []);
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(NzPaginationComponent) paginator: NzPaginationComponent;
  @Output() refresh = new EventEmitter<void>();

  displayedColumns: string[];
  searchForm: FormGroup;

  protected abstract editDialogType(): ComponentType<EDIT_DIALOG>;

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: MODEL): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  ngAfterViewInit(): void {
    flow(merge(this.searchForm.valueChanges, this.refresh, this.paginator.nzPageIndexChange)
      .pipe(
        debounceTime(200),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.baseRepository.queryPage(
            this.paginator.nzPageIndex,
            this.paginator.nzPageSize,
            this.searchForm.value
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.resultsLength = data.totalElements;
          return data.content;
        })), err => {
      this.isLoadingResults = false;
      console.error(err);
    }).subscribe(data => {
      this.data = data;
      this.selection.clear();
    });
    this.refresh.emit();
  }

  showEditDialog(row: MODEL): void {
    const record = {...row};
    this.modal.create({
      nzContent: this.editDialogType(),
      nzFooter: null,
      // nzComponentParams: {mode: 'edit', data: record},
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }

  // showCreateDialog() {
  //   this.modal.confirm(this.editDialogType(), {
  //     data: {
  //       mode: 'create',
  //       record: {},
  //     }
  //   }).afterClosed().subscribe(needRefresh => {
  //     if (!!needRefresh) {
  //       this.refresh.emit();
  //     }
  //   });
  // }
}
