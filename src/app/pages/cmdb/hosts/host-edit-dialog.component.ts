import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {HostRepository} from '../../../shared/services/host-repository';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';
import {Host} from '../../../shared/models/host';

@Component({
  selector: 'app-host-edit-dialog',
  templateUrl: './host-edit-dialog.component.html',
  styleUrls: ['./host-edit-dialog.component.scss']
})
export class HostEditDialogComponent extends BaseEditDialogComponent<Host> implements OnInit {

  constructor(
    private fb: FormBuilder,
    protected nzModalRef: NzModalRef<HostEditDialogComponent>,
    protected hostRepository: HostRepository,
    protected nzMessageService: NzMessageService
  ) {
    super(hostRepository, nzModalRef, nzMessageService);
  }

  @Input() mode = '';
  @Input() data;

  editForm = this.fb.group({
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
    this.editForm.get('id').setValue(this.data.id);
    this.editForm.get('hostInnerip').setValue(this.data.hostInnerip);
    this.editForm.get('hostOuterip').setValue(this.data.hostOuterip);
    this.editForm.get('mac').setValue(this.data.mac);
    this.editForm.get('outerMac').setValue(this.data.outerMac);
    this.editForm.get('assertId').setValue(this.data.assertId);
    this.editForm.get('sn').setValue(this.data.sn);
    this.editForm.get('state').setValue(this.data.state);
    this.editForm.get('hostName').setValue(this.data.hostName);
    this.editForm.get('osType').setValue(this.data.osType);
    this.editForm.get('osName').setValue(this.data.osName);
    this.editForm.get('osVersion').setValue(this.data.osVersion);
    this.editForm.get('mem').setValue(this.data.mem);
    this.editForm.get('osBit').setValue(this.data.osBit);
    this.editForm.get('disk').setValue(this.data.disk);
    this.editForm.get('sshUser').setValue(this.data.sshUser);
    this.editForm.get('sshPort').setValue(this.data.sshPort);
    this.editForm.get('comment').setValue(this.data.comment);
  }

  // onClose(): void {
  //   this.nzModalRef.close();
  // }
  // onSubmit(): void {
  //   const value = this.editForm.value;
  //   (this.mode === 'edit' ? this.hostRepository.update(value) :
  //     this.hostRepository.add(value)).subscribe(res => {
  //     this.nzMessageService.info(this.mode === 'edit' ? '修改成功' : '新增成功');
  //     this.nzModalRef.close(res);
  //   });
  // }
}
