import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {ReplicaSetRepository} from '../../../shared/services/replica-set-repository';
import {NzMessageService} from 'ng-zorro-antd/message';
import {BaseEditDialogComponent} from '../../../shared/base-edit-dialog/base-edit-dialog.component';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';

@Component({
  selector: 'app-replica-set-edit-dialog',
  templateUrl: './replica-set-edit-dialog.component.html',
  styleUrls: ['./replica-set-edit-dialog.component.scss']
})
export class ReplicaSetEditDialogComponent extends BaseEditDialogComponent<ReplicaSet>
  implements OnInit, AfterViewInit {

  constructor(
    protected replicaSetRepository: ReplicaSetRepository,
    protected nzModalRef: NzModalRef,
    protected nzMessageService: NzMessageService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
  ) {
    super(replicaSetRepository, nzModalRef, nzMessageService);
  }

  @Input() mode = '';
  @Input() data;
  filteredApps: Observable<App[]>;
  @ViewChild('appIdAuto') appIdAuto: NzAutocompleteComponent;
  editForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    appId: [, Validators.required],
    comment: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.editForm.get('id').setValue(this.data.id);
      this.editForm.get('name').setValue(this.data.name);
      this.editForm.get('appId').setValue(this.data.appId);
      this.editForm.get('comment').setValue(this.data.comment);
    }
  }

  ngAfterViewInit(): void {
    this.filteredApps = this.helperService.appAutoHelp(
      this.appIdAuto, this.editForm.get('appId'), this.data.appId
    );
  }
}
