import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {HostRepository} from '../../../shared/services/host-repository';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-host-edit-dialog',
  templateUrl: './host-edit-dialog.component.html',
  styleUrls: ['./host-edit-dialog.component.scss']
})
export class HostEditDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private nzModalRef: NzModalRef,
    private hostRepository: HostRepository,
    private nzMessageService: NzMessageService
  ) { }

  @Input() mode = '';
  @Input() data;
  searchForm = this.fb.group({
    id: [''],
    hostInnerip: ['', Validators.required],
    hostOuterip: [''],
    mac: [''],
    outerMac: [''],
    assertId: [''],
    sn: [''],
    state: ['', Validators.required],
    hostName: ['', Validators.required],
    osType: [''],
    osName: [''],
    osVersion: [''],
    osBit: [''],
    mem: [],
    disk: [],
    sshUser: [''],
    sshPort: [],
    comment: ['']
  });

  ngOnInit(): void {
    this.searchForm.get('id').setValue(this.data.id);
    this.searchForm.get('hostInnerip').setValue(this.data.hostInnerip);
    this.searchForm.get('hostOuterip').setValue(this.data.hostOuterip);
    this.searchForm.get('mac').setValue(this.data.mac);
    this.searchForm.get('outerMac').setValue(this.data.outerMac);
    this.searchForm.get('assertId').setValue(this.data.assertId);
    this.searchForm.get('sn').setValue(this.data.sn);
    this.searchForm.get('state').setValue(this.data.state);
    this.searchForm.get('hostName').setValue(this.data.hostName);
    this.searchForm.get('osType').setValue(this.data.osType);
    this.searchForm.get('osName').setValue(this.data.osName);
    this.searchForm.get('osVersion').setValue(this.data.osVersion);
    this.searchForm.get('mem').setValue(this.data.mem);
    this.searchForm.get('osBit').setValue(this.data.osBit);
    this.searchForm.get('disk').setValue(this.data.disk);
    this.searchForm.get('sshUser').setValue(this.data.sshUser);
    this.searchForm.get('sshPort').setValue(this.data.sshPort);
    this.searchForm.get('comment').setValue(this.data.comment);
  }

  onClose(): void {
    this.nzModalRef.close();
  }
  onSubmit(): void {
    const value = this.searchForm.value;
    (this.mode === 'edit' ? this.hostRepository.update(value) :
      this.hostRepository.add(value)).subscribe(res => {
      this.nzMessageService.info(this.mode === 'edit' ? '修改成功' : '新增成功');
      this.nzModalRef.close(res);
    });
  }
}
