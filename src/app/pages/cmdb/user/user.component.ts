import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {UserDialogComponent} from './user-dialog.component';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {User} from '../../../shared/models/user';
import {UserRepository} from '../../../shared/services/user-repository';
import {FormBuilder} from '@angular/forms';
import {ComponentType} from '@angular/cdk/overlay';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor(
    protected modal: NzModalService,
    protected viewContainerRef: ViewContainerRef,

    protected userRepository: UserRepository,
    private fb: FormBuilder
  ) {
  }

  searchForm = this.fb.group({
    username: [],
    realName: [],
    mobile: [],
    mail: [],
  });
  checked = false;
  loading = false;
  indeterminate = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  listOfData: any = [];
  listOfCurrentPageData: any;
  setOfCheckedId = new Set<number>();

  ngOnInit(): void {
    this.userRepository.queryPage(
      0, 10
    ).subscribe(res => {
      this.listOfData = res.content;
    });
  }

  showEditDialog(ele): void{
    this.modal.create({
      nzContent: UserDialogComponent,
      nzTitle: '修改用户',
      nzComponentParams: {mode: 'edit', data: ele},
      // nzViewContainerRef: this.viewContainerRef,
      // nzOkText: null,
      // nzCancelText: null,
      nzFooter: null,
    }).afterClose.subscribe(result => console.log(result, '什么'));
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(listOfCurrentPageData): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.filter(({ disabled }) => !disabled).forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
}
