import {AfterViewInit, Component, OnInit, Type, ViewChild} from '@angular/core';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {Chart} from '../../../shared/models/chart';
import {ChartEditComponent} from '../chart-edit/chart-edit.component';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {Instance} from '../../../shared/models/instance';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {RepositoryHelperService} from "../../../shared/services/repository-helper.service";

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent extends BaseResourceComponent<Chart, ChartEditComponent>
  implements OnInit, AfterViewInit {

  constructor(
    protected chartRepository: ChartRepository,
    protected nzModalService: NzModalService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
  ) {
    super(chartRepository, nzModalService);
  }

  filteredApps: Observable<App[]>;
  @ViewChild('appIdAuto') appIdAuto: NzAutocompleteComponent;

  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;

  filteredInstances: Observable<Instance[]>;
  @ViewChild('instanceIdAuto') instanceIdAuto: NzAutocompleteComponent;

  searchForm = this.fb.group({
    name: [],
    displayName: [],
    appId: [],
    replicaSetId: [],
    instanceId: []
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.filteredApps = this.helperService.appAutoHelp(this.appIdAuto, this.searchForm.get('appId'));
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(
      this.replicaSetIdAuto, this.searchForm.get('replicaSetId'));
    this.filteredInstances = this.helperService.instanceAutoHelp(
      this.instanceIdAuto, this.searchForm.get('instanceId'));
  }

  protected editDialogType(): Type<ChartEditComponent> {
    return ChartEditComponent;
  }

}
