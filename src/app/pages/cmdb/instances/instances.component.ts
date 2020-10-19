import {AfterViewInit, Component, OnInit, Type, ViewChild} from '@angular/core';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {InstanceEditDialogComponent} from './instance-edit-dialog.component';
import {InstanceRepository} from '../../../shared/services/instance-repository';
import {Instance} from '../../../shared/models/instance';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {Host} from '../../../shared/models/host';

@Component({
  selector: 'app-instances',
  templateUrl: './instances.component.html',
  styleUrls: ['./instances.component.scss']
})
export class InstancesComponent extends BaseResourceComponent<Instance, InstanceEditDialogComponent>
  implements OnInit, AfterViewInit {

  constructor(
    protected instanceRepository: InstanceRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService
  ) {
    super(instanceRepository, modal);
  }

  filteredApps: Observable<App[]>;
  @ViewChild('auto') appIdAuto: NzAutocompleteComponent;
  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredHosts: Observable<Host[]>;
  @ViewChild('hostIdAuto') hostIdAuto: NzAutocompleteComponent;

  searchForm = this.fb.group({
    name: [],
    replicaSetId: [],
    hostId: [],
    appId: [],
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.filteredApps = this.helperService.appAutoHelp(this.appIdAuto, this.searchForm.get('appId'));
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(this.replicaSetIdAuto,
      this.searchForm.get('replicaSetId'));
    this.filteredHosts = this.helperService.hostAutHelp(this.hostIdAuto, this.searchForm.get('hostId'));
  }

  protected editDialogType(): Type<InstanceEditDialogComponent> {
    return InstanceEditDialogComponent;
  }
}
