import {AfterViewInit, Component, EventEmitter, Output, Type, ViewChild} from '@angular/core';
import {BaseRepository} from '../services/base.repository';
import {SelectionModel} from '@angular/cdk/collections';
import {FormGroup} from '@angular/forms';
import {merge} from 'rxjs';
import {flow} from '../stream/stream';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTableComponent} from 'ng-zorro-antd/table';

export interface EditDialogData<MODEL extends {id?: number}> {
  mode: string;
  record: MODEL;
}

@Component({
  selector: 'app-base-resource',
  template: ``
})
export abstract class BaseResourceComponent<MODEL extends {id?: number}, EDIT_DIALOG = any>
  implements AfterViewInit {
  protected constructor(protected baseRepository: BaseRepository<MODEL>,
                        protected modal: NzModalService) {
  }
  data: MODEL[] = [];
  selection = new SelectionModel<MODEL>(true, []);
  total = 0;
  isLoadingResults = true;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  @ViewChild(NzTableComponent) table: NzTableComponent;
  @Output() refresh = new EventEmitter<void>();

  displayedColumns: string[];
  searchForm: FormGroup;

  protected abstract editDialogType(): Type<EDIT_DIALOG>;

  // isAllSelected(): boolean {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.data.length;
  //   return numSelected === numRows;
  // }
  // masterToggle(): void {
  //   this.isAllSelected() ?
  //     this.selection.clear() :
  //     this.data.forEach(row => this.selection.select(row));
  // }
  // checkboxLabel(row?: MODEL): string {
  //   if (!row) {
  //     return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
  //   }
  //   return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  // }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(): void {
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.data;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.data.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  ngAfterViewInit(): void {
    flow(merge(this.searchForm.valueChanges, this.refresh, this.table.nzPageIndexChange, this.table.nzPageSizeChange)
      .pipe(
        debounceTime(200),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.baseRepository.queryPage(
            this.table.nzPageIndex - 1,
            this.table.nzPageSize,
            this.searchForm.value
          );
        }),
        map(data => {
          this.isLoadingResults = false;
          this.total = data.totalElements;
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
      nzComponentParams: {mode: 'edit', data: record},
      nzWidth: 830,
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }

  showCreateDialog(): void {
    this.modal.create({
      nzContent: this.editDialogType(),
      nzComponentParams: {mode: 'create', data: {}},
      nzFooter: null,
      nzWidth: 830,
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }
}
