import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';
import {Playbook} from '../../../shared/models/playbook';
import {PlaybookRepository} from '../../../shared/services/playbook-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {Instance} from '../../../shared/models/instance';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';

@Component({
  selector: 'app-playbook-edit-dialog',
  templateUrl: './playbook-edit-dialog.component.html',
  styleUrls: ['./playbook-edit-dialog.component.scss']
})
export class PlaybookEditDialogComponent extends BaseEditDialogComponent<Playbook>
  implements OnInit, AfterViewInit {

  constructor(
    protected playbookRepository: PlaybookRepository,
    protected nzModalRef: NzModalRef,
    protected nzMessageService: NzMessageService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
  ) {
    super(playbookRepository, nzModalRef, nzMessageService);
  }

  @Input() mode = '';
  @Input() data;
  editForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    displayName: [''],
    referenceId: this.fb.group({
      appId: [],
      replicaSetId: [],
      instanceId: [],
    }, {validators: this.referenceIdValidator}),
    content: [''],
    comment: ['']
  });

  @ViewChild('appIdAuto') appIdAuto: NzAutocompleteComponent;
  filteredApps: Observable<App[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('instanceIdAuto') instanceIdAuto: NzAutocompleteComponent;
  filteredInstances: Observable<Instance[]>;

  referenceIdFormGroup = this.editForm.get('referenceId');
  referenceIdValidator(control: FormGroup): ValidationErrors | null {
    const values = Object.values(control.controls).map(c => c.value);
    const length = values.filter(v => !!v).length;
    if (length === 1) {
      return null;
    }
    return {referenceId: true};
  }

  protected genFormValue(): any {
    const value = { ...this.editForm.value };
    const referenceId = value.referenceId;
    delete value.referenceId;
    if (referenceId.appId) {
      value.appId = referenceId.appId;
      return value;
    }
    if (referenceId.replicaSetId) {
      value.replicaSetId = referenceId.replicaSetId;
      return value;
    }
    if (referenceId.instanceId) {
      value.instanceId = referenceId.instanceId;
      return value;
    }
  }

  ngOnInit(): void {
    if (this.data) {
      this.editForm.get('id').setValue(this.data.id);
      this.editForm.get('name').setValue(this.data.name);
      this.referenceIdFormGroup.get('appId').setValue(this.data.appId);
      this.editForm.get('displayName').setValue(this.data.displayName);
      this.referenceIdFormGroup.get('replicaSetId').setValue(this.data.replicaSetId);
      this.referenceIdFormGroup.get('instanceId').setValue(this.data.instanceId);
      this.editForm.get('content').setValue(this.data.content);
      this.editForm.get('comment').setValue(this.data.comment);
    }
  }

  ngAfterViewInit(): void {
    this.filteredApps = this.helperService.appAutoHelp(
      this.appIdAuto,
      this.referenceIdFormGroup.get('appId'),
      this.data.appId);
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(
      this.replicaSetIdAuto,
      this.referenceIdFormGroup.get('replicaSetId'),
      this.data.replicaSetId);
    this.filteredInstances = this.helperService.instanceAutoHelp(
      this.instanceIdAuto,
      this.referenceIdFormGroup.get('instanceId'),
      this.data.instanceId
    );
  }
}
