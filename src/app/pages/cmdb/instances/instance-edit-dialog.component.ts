import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {Host} from '../../../shared/models/host';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {FormBuilder, Validators} from '@angular/forms';
import {InstanceRepository} from "../../../shared/services/instance-repository";
import {NzModalRef} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: 'app-instance-edit-dialog',
  templateUrl: './instance-edit-dialog.component.html',
  styleUrls: ['./instance-edit-dialog.component.scss']
})
export class InstanceEditDialogComponent implements OnInit, AfterViewInit {

  constructor(
    private helperService: RepositoryHelperService,
    private fb: FormBuilder,
    private instanceRepository: InstanceRepository,
    private nzModalRef: NzModalRef,
    private nzMessageService: NzMessageService,
  ) { }

  @Input() mode = '';
  @Input() data;
  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredHosts: Observable<Host[]>;
  @ViewChild('hostIdAuto') hostIdAuto: NzAutocompleteComponent;
  editForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    replicaSetId: ['', Validators.required],
    hostId: ['', Validators.required],
    workDir: [''],
    metricUrl: [''],
    comment: ['']
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(this.replicaSetIdAuto,
      this.editForm.get('replicaSetId'));
    this.filteredHosts = this.helperService.hostAutHelp(this.hostIdAuto, this.editForm.get('hostId'));
  }

  onSubmit(): void{
    const value = this.editForm.value;
    (this.mode === 'edit' ? this.instanceRepository.update(value) :
      this.instanceRepository.add(value)).subscribe(result => {
      this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
      this.nzModalRef.close(result);
    });
  }
  onClose(): void{
    this.nzModalRef.close();
  }
}
