import {AfterViewInit, Component, EventEmitter, Output, Type, ViewChild} from '@angular/core';
import {BaseRepository} from '../services/base.repository';
import {FormGroup} from '@angular/forms';
import {merge} from 'rxjs';
import {flow} from '../stream/stream';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTableComponent} from 'ng-zorro-antd/table';

export interface EditDialogData<MODEL extends {id?: number}> {
  mode: string;
  data: MODEL;
}

@Component({
  selector: 'app-base-resource',
  template: ``
})
export abstract class BaseResourceComponent<MODEL extends {id?: number}, EDIT_DIALOG>
  implements AfterViewInit {
  protected constructor(
    protected baseRepository: BaseRepository<MODEL>,
    protected modal: NzModalService,
  ) {
  }
  data: MODEL[] = [];
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  isLoadingResults = true;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  @ViewChild(NzTableComponent) table: NzTableComponent;
  @Output() refresh = new EventEmitter<void>();

  displayedColumns: string[];
  searchForm: FormGroup;

  protected abstract editDialogType(): Type<EDIT_DIALOG>;

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
    const data = this.data;
    this.checked = data.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = data.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
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
