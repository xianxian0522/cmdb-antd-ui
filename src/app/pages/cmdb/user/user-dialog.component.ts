import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserRepository} from '../../../shared/services/user-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {User} from '../../../shared/models/user';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent extends BaseEditDialogComponent<User> implements OnInit {

  constructor(
    private fb: FormBuilder,
    protected userRepository: UserRepository,
    protected nzModalRef: NzModalRef<UserDialogComponent>,
    protected nzMessageService: NzMessageService
  ) {
    super(userRepository, nzModalRef, nzMessageService);
  }
  @Input() mode = '';
  @Input() data;

  editForm = this.fb.group({
    id: [],
    mobile: [''],
    username: ['', Validators.required],
    realName: [''],
    mail: ['', Validators.email],
  });

  ngOnInit(): void {
    // this.editForm.setValue({...this.data});
    if (this.data) {
      this.editForm.get('id').setValue(this.data.id);
      this.editForm.get('mobile').setValue(this.data.mobile);
      this.editForm.get('username').setValue(this.data.username);
      this.editForm.get('realName').setValue(this.data.realName);
      this.editForm.get('mail').setValue(this.data.mail);
    }
  }

  // onSubmit(): void{
  //   const value = this.editForm.value;
  //   (this.mode === 'edit' ? this.userRepository.update(value) :
  //     this.userRepository.add(value)).subscribe(result => {
  //     this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
  //     this.nzModalRef.close(result);
  //   });
  // }
  // onClose(): void{
  //   this.nzModalRef.close();
  // }
}
