import {Component, Input, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserRepository} from '../../../shared/services/user-repository';
import {AppRepository} from '../../../shared/services/app-repository';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-app-add-owner',
  templateUrl: './app-add-owner.component.html',
  styleUrls: ['./app-add-owner.component.scss']
})
export class AppAddOwnerComponent implements OnInit {

  constructor(
    private userRepository: UserRepository,
    private appRepository: AppRepository,
    private nzMessageService: NzMessageService,
    private nzModalRef: NzModalRef,
  ) { }

  addAppId: number;
  owner = new FormControl('', Validators.required);
  reporters = new FormControl([]);
  userAll: any = [];
  @Input() data;

  ngOnInit(): void {
    this.addAppId = this.data.id;
    this.userRepository.queryAll().subscribe(res => {
      this.userAll = res.filter(u => u.username !== 'admin');
      console.log(this.data, res);
      this.owner.setValue(this.data.ownerId);
      const s = (this.data.reporters || []).map(u => u.id);
      this.reporters.setValue(s);
    });
  }

  handleCancel(): void {
    this.nzModalRef.close();
  }
  // 给这个应用管理增加负责人以及报告人
  handleOk(): void {
    const value = {
      id: this.addAppId,
      ownerId: this.owner.value,
      reporterIds: this.reporters.value
    };
    this.appRepository.update(value).subscribe(res => {
      this.nzMessageService.success('修改成功', {nzDuration: 3000});
      this.nzModalRef.close(res);
    }, err => {
      this.nzMessageService.error('修改失败', {nzDuration: 3000});
    });
  }
}
