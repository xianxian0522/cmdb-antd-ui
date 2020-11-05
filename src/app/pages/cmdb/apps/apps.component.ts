import {AfterViewInit, Component, OnInit, Type} from '@angular/core';
import {AppRepository} from '../../../shared/services/app-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {App} from '../../../shared/models/app';
import {AppEditDialogComponent} from './app-edit-dialog.component';
import {UserRepository} from '../../../shared/services/user-repository';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AppAddOwnerComponent} from './app-add-owner.component';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent extends BaseResourceComponent<App, AppEditDialogComponent> implements OnInit, AfterViewInit {

  constructor(
    protected appRepository: AppRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    private userRepository: UserRepository,
    private nzMessageService: NzMessageService
  ) {
    super(appRepository, modal);
  }

  searchForm = this.fb.group({
    name: [],
    cnName: [],
    programmingLanguage: [],
    level: [],
  });
  addAppId: number;
  owner = new FormControl('', Validators.required);
  reporters = new FormControl([]);

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected editDialogType(): Type<AppEditDialogComponent> {
    return AppEditDialogComponent;
  }

  addEditDialog(ele): void {
    // this.isVisible = true;
    // this.addAppId = ele.id;
    // this.userRepository.queryAll().subscribe(res => {
    //   this.userAll = res.filter(u => u.username !== 'admin');
    //   console.log(ele, res);
    //   this.owner.setValue(ele.ownerId);
    //   const s = (ele.reporters || []).map(u => u.id);
    //   setTimeout(() => this.reporters.setValue(s), 1000);
    // });
    this.modal.create({
      nzContent: AppAddOwnerComponent,
      nzComponentParams: {data: ele},
      nzFooter: null,
      nzTitle: '修改负责人及报告人'
    }).afterClose.subscribe(result => {
      if (result) {
        this.refresh.emit();
      }
    });
  }
  // handleCancel(): void {
  //   this.isVisible = false;
  // }
  // // 给这个应用管理增加负责人以及报告人
  // handleOk(): void {
  //   const value = {
  //     id: this.addAppId,
  //     ownerId: this.owner.value,
  //     reporterIds: this.reporters.value
  //   };
  //   this.appRepository.update(value).subscribe(res => {
  //     this.nzMessageService.success('新增成功', {nzDuration: 3000});
  //     this.isVisible = false;
  //     this.refresh.emit();
  //   }, err => {
  //     this.nzMessageService.error('新增失败', {nzDuration: 3000});
  //     this.isVisible = false;
  //   });
  // }
}
