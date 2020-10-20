import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AppRepository} from '../../../shared/services/app-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';
import {App} from '../../../shared/models/app';

@Component({
  selector: 'app-app-edit-dialog',
  templateUrl: './app-edit-dialog.component.html',
  styleUrls: ['./app-edit-dialog.component.scss']
})
export class AppEditDialogComponent extends BaseEditDialogComponent<App> implements OnInit {

  constructor(
    private fb: FormBuilder,
    protected appRepository: AppRepository,
    protected nzModalRef: NzModalRef,
    protected nzMessageService: NzMessageService
  ) {
    super(appRepository, nzModalRef, nzMessageService);
  }

  @Input() mode = '';
  @Input() data;

  editForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    cnName: [''],
    programmingLanguage: [''],
    level: [''],
    repository: [''],
    comment: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.editForm.get('id').setValue(this.data.id);
      this.editForm.get('name').setValue(this.data.name);
      this.editForm.get('cnName').setValue(this.data.cnName);
      this.editForm.get('programmingLanguage').setValue(this.data.programmingLanguage);
      this.editForm.get('level').setValue(this.data.level);
      this.editForm.get('repository').setValue(this.data.repository);
      this.editForm.get('comment').setValue(this.data.comment);
    }
  }

  // onSubmit(): void{
  //   const value = this.searchForm.value;
  //   (this.mode === 'edit' ? this.appRepository.update(value) :
  //     this.appRepository.add(value)).subscribe(result => {
  //     this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
  //     this.nzModalRef.close(result);
  //   });
  // }
  // onClose(): void{
  //   this.nzModalRef.close();
  // }
}
