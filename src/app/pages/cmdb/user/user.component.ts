import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UserDialogComponent} from './user-dialog.component';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {User} from '../../../shared/models/user';
import {UserRepository} from '../../../shared/services/user-repository';
import {FormBuilder} from '@angular/forms';
import {ComponentType} from '@angular/cdk/overlay';
import {merge} from 'rxjs';
import {NzTableComponent} from 'ng-zorro-antd/table';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseResourceComponent<User, UserDialogComponent> implements OnInit, AfterViewInit {

  constructor(
    protected modal: NzModalService,
    protected viewContainerRef: ViewContainerRef,

    protected userRepository: UserRepository,
    private fb: FormBuilder,
  ) {
    super(userRepository, modal);
  }

  searchForm = this.fb.group({
    username: [],
    realName: [],
    mobile: [],
    mail: [],
  });
  // checked = false;
  loading = false;
  // indeterminate = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  // listOfData: any = [];
  // setOfCheckedId = new Set<number>();
  // @Output() refresh = new EventEmitter<void>();
  // @ViewChild(NzTableComponent) table: NzTableComponent;

  protected editDialogType(): ComponentType<UserDialogComponent> {
    return UserDialogComponent;
  }

  ngOnInit(): void {
    // this.getData();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // merge(this.searchForm.valueChanges,
    //   this.refresh, this.table.nzPageIndexChange,
    //   this.table.nzPageSizeChange
    // ).subscribe(_ => {
    //   this.userRepository.queryPage(
    //     this.table.nzPageIndex - 1,
    //     this.table.nzPageSize,
    //     this.searchForm.value
    //   ).subscribe(res => {
    //     this.listOfData = res.content;
    //     this.total = res.totalElements;
    //   });
    // });
    // this.refresh.emit();
  }

  getData(): void {
    // this.userRepository.queryPage(
    //   0, 10
    // ).subscribe(res => {
    //   this.listOfData = res.content;
    // });
  }

  // showEditDialog(ele): void{ // 修改
  //   this.modal.create({
  //     nzContent: UserDialogComponent,
  //     nzTitle: '修改用户',
  //     nzComponentParams: {mode: 'edit', data: ele},
  //     // nzViewContainerRef: this.viewContainerRef,
  //     // nzOkText: null,
  //     // nzCancelText: null,
  //     nzFooter: null,
  //   }).afterClose.subscribe(result => {
  //     if (result) {
  //       // this.getData();
  //       this.refresh.emit();
  //     }
  //   });
  // }
  //
  // showCreateDialog(): void{ // 新增
  //   this.modal.create({
  //     nzContent: UserDialogComponent,
  //     nzTitle: '新增用户',
  //     nzComponentParams: {mode: 'create', data: {}},
  //     nzFooter: null,
  //   }).afterClose.subscribe(result => {
  //     if (result) {
  //       // this.getData();
  //       this.refresh.emit();
  //     }
  //   });
  // }
  //
  // onQueryParamsChange(event): void { // 改变页数
  //   console.log(event);
  // }
  //
  // updateCheckedSet(id: number, checked: boolean): void {
  //   if (checked) {
  //     this.setOfCheckedId.add(id);
  //   } else {
  //     this.setOfCheckedId.delete(id);
  //   }
  // }
  // onCurrentPageDataChange(): void {
  //   this.refreshCheckedStatus();
  // }
  // refreshCheckedStatus(): void {
  //   const listOfEnabledData = this.listOfData;
  //   this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
  //   this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  // }
  // onAllChecked(checked: boolean): void {
  //   this.listOfData.forEach(({ id }) => this.updateCheckedSet(id, checked));
  //   this.refreshCheckedStatus();
  // }
  // onItemChecked(id: number, checked: boolean): void {
  //   this.updateCheckedSet(id, checked);
  //   this.refreshCheckedStatus();
  // }
}
