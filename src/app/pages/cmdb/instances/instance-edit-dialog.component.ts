import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {Host} from '../../../shared/models/host';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {FormBuilder, Validators} from '@angular/forms';
import {InstanceRepository} from '../../../shared/services/instance-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';
import {Instance} from '../../../shared/models/instance';

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.scss']
})
export class InstanceEditDialogComponent extends BaseEditDialogComponent<Instance> implements OnInit, AfterViewInit {

  constructor(
    private helperService: RepositoryHelperService,
    private fb: FormBuilder,
    protected instanceRepository: InstanceRepository,
    protected nzModalRef: NzModalRef,
    protected nzMessageService: NzMessageService,
  ) {
    super(instanceRepository, nzModalRef, nzMessageService);
  }

  @Input() mode = '';
  @Input() data;

  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredHosts: Observable<Host[]>;
  @ViewChild('hostIdAuto') hostIdAuto: NzAutocompleteComponent;
  editForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    replicaSetId: [, Validators.required],
    hostId: [, Validators.required],
    workDir: [''],
    metricUrl: [''],
    comment: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.editForm.get('id').setValue(this.data.id);
      this.editForm.get('name').setValue(this.data.name);
      this.editForm.get('replicaSetId').setValue(this.data.replicaSetId);
      this.editForm.get('hostId').setValue(this.data.hostId);
      this.editForm.get('workDir').setValue(this.data.workDir);
      this.editForm.get('metricUrl').setValue(this.data.metricUrl);
      this.editForm.get('comment').setValue(this.data.comment);
    }
  }

  ngAfterViewInit(): void {
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(this.replicaSetIdAuto,
      this.editForm.get('replicaSetId'), this.data.replicaSetId);
    this.filteredHosts = this.helperService.hostAutHelp(
      this.hostIdAuto, this.editForm.get('hostId'), this.data.hostId);
  }

  // onSubmit(): void{
  //   const value = this.editForm.value;
  //   (this.mode === 'edit' ? this.instanceRepository.update(value) :
  //     this.instanceRepository.add(value)).subscribe(result => {
  //     this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
  //     this.nzModalRef.close(result);
  //   });
  // }
  // onClose(): void{
  //   this.nzModalRef.close();
  // }
}
