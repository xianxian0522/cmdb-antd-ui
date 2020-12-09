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
import {FormBuilder, FormControl} from '@angular/forms';
import {ComponentType} from '@angular/cdk/overlay';
import {merge} from 'rxjs';
import {NzTableComponent} from 'ng-zorro-antd/table';
import {NzMessageService} from 'ng-zorro-antd/message';
import {ActivatedRoute, Router} from '@angular/router';

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
    private nzMessageService: NzMessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
    super(userRepository, modal, activatedRoute, router);
  }

  searchForm = this.fb.group({
    username: [],
    realName: [],
    mobile: [],
    mail: [],
  });
  // checked = false;
  // indeterminate = false;
  // total = 1;
  // pageSize = 10;
  // pageIndex = 1;
  // listOfData: any = [];
  // setOfCheckedId = new Set<number>();
  // @Output() refresh = new EventEmitter<void>();
  // @ViewChild(NzTableComponent) table: NzTableComponent;

  isVisible = false;
  password = new FormControl('');
  userId: number;

  protected editDialogType(): ComponentType<UserDialogComponent> {
    return UserDialogComponent;
  }

  ngOnInit(): void {
    super.ngOnInit();
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

  // 修改密码
  showPasswordDialog(ele): void {
    this.isVisible = true;
    this.userId = ele.id;
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  handleOk(): void {
    const value = {id: this.userId, password: this.password.value};
    this.userRepository.update(value).subscribe(res => {
      this.nzMessageService.info('修改成功', {nzDuration: 3000});
      this.isVisible = false;
    }, err => {
      this.nzMessageService.error('修改失败', {nzDuration: 3000});
      this.isVisible = false;
    });
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
