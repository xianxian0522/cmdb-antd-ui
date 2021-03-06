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
import {ActivatedRoute, Router} from '@angular/router';

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
    private nzMessageService: NzMessageService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
    super(appRepository, modal, activatedRoute, router);
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
    super.ngOnInit();
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
      nzTitle: '???????????????????????????'
    }).afterClose.subscribe(result => {
      if (result) {
        this.refresh.emit();
      }
    });
  }
  // handleCancel(): void {
  //   this.isVisible = false;
  // }
  // // ???????????????????????????????????????????????????
  // handleOk(): void {
  //   const value = {
  //     id: this.addAppId,
  //     ownerId: this.owner.value,
  //     reporterIds: this.reporters.value
  //   };
  //   this.appRepository.update(value).subscribe(res => {
  //     this.nzMessageService.success('????????????', {nzDuration: 3000});
  //     this.isVisible = false;
  //     this.refresh.emit();
  //   }, err => {
  //     this.nzMessageService.error('????????????', {nzDuration: 3000});
  //     this.isVisible = false;
  //   });
  // }
}
