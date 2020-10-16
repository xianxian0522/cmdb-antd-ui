import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {UserRepository} from '../../../shared/services/user-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userRepository: UserRepository,
    private nzModalRef: NzModalRef,
    private nzMessageService: NzMessageService
  ) { }
  @Input() mode = '';
  @Input() data;

  searchForm = this.fb.group({
    id: [''],
    mobile: [''],
    username: ['', Validators.required],
    realName: [''],
    mail: ['', Validators.email],
  });

  ngOnInit(): void {
    this.searchForm.get('id').setValue(this.data.id);
    this.searchForm.get('mobile').setValue(this.data.mobile);
    this.searchForm.get('username').setValue(this.data.username);
    this.searchForm.get('realName').setValue(this.data.realName);
    this.searchForm.get('mail').setValue(this.data.mail);
  }

  onSubmit(): void{
    const value = this.searchForm.value;
    (this.mode === 'edit' ? this.userRepository.update(value) :
      this.userRepository.add(value)).subscribe(result => {
      this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
      this.nzModalRef.close(result);
    });
  }
  onClose(): void{
    this.nzModalRef.close();
  }
}
