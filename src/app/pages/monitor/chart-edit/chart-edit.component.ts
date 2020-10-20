import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {merge, Observable, of} from 'rxjs';
import {Chart} from '../../../shared/models/chart';
import {FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {App} from '../../../shared/models/app';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {Instance} from '../../../shared/models/instance';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';

export interface Data {
  id?: number;
  name?: string;
  displayName?: string;
  content?: string;
  comment?: string;
  appId?: number;
  appName?: string;
  replicaSetId?: number;
  replicaSetName?: string;
  instanceId?: number;
  instanceName?: string;
  createdAt?: string;
  updatedAt?: string;
  query?: string;
}

@Component({
  selector: 'app-chart-edit',
  templateUrl: './chart-edit.component.html',
  styleUrls: ['./chart-edit.component.scss']
})
export class ChartEditComponent implements OnInit, AfterViewInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private chartRepository: ChartRepository,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService
  ) { }

  id: number = null;
  data: Data;
  @ViewChild('appIdAuto') appIdAuto: NzAutocompleteComponent;
  filteredApps: Observable<App[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('instanceIdAuto') instanceIdAuto: NzAutocompleteComponent;
  filteredInstances: Observable<Instance[]>;

  editForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    displayName: [''],
    referenceId: this.fb.group({
      appId: [''],
      replicaSetId: [''],
      instanceId: [''],
    }, {validators: this.referenceIdValidator}),
    content: [''],
    comment: [''],
    query: ['', Validators.required],
    config: this.fb.group({
      bars: [false],
      lines: [true],
      points: [false],
      stack: [false],
      type: [''],
    }),
    radio: [''],
  });
  seasons: string[] = ['bars', 'lines', 'points'];

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
    const value = {...this.editForm.value};
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
  }

  statusChange(ts): void {
    const config = this.editForm.get('config');
    config.get(ts).setValue(true);
    if (ts === 'bars') {
      config.get('points').setValue(false);
      config.get('lines').setValue(false);
    } else if (ts === 'lines') {
      config.get('bars').setValue(false);
      config.get('points').setValue(false);
    } else if (ts === 'points') {
      config.get('bars').setValue(false);
      config.get('lines').setValue(false);
    }
    console.log(config.value);
  }
  stackChange(): void {
    const stack = this.editForm.get('config').get('stack').value;
    console.log(stack, this.editForm.get('radio').value);
    // if (this.seriesState) {
    //   const series = this.seriesState.map(v => {
    //     return stack ? {
    //       stack: 'counts',
    //       areaStyle: {normal: {}},
    //     } : {
    //       stack: '',
    //       areaStyle: null,
    //     };
    //   });
    //   this.echartsMerge = {series};
    // }
  }

  selectChart(): void{

  }

  onSubmit(): void {
    console.log(this.editForm.get('config').value);
  }

  ngAfterViewInit(): void {
    const chartChange = this.activatedRoute.queryParams.pipe(
      switchMap(params => params.id ? this.chartRepository.getById(params.id) : of(null)),
      map((chart: Chart) => {
        if (chart) {
          setTimeout(() => this.id = chart.id);
          this.data = chart;
          this.editForm.get('id').setValue(this.data.id);
          this.editForm.get('name').setValue(this.data.name);
          this.editForm.get('displayName').setValue(this.data.displayName);
          this.editForm.get('content').setValue(this.data.content);
          this.editForm.get('comment').setValue(this.data.comment);
          this.editForm.get('query').setValue(this.data.query);
          this.referenceIdFormGroup.get('appId').setValue(this.data.appId);
          this.referenceIdFormGroup.get('replicaSetId').setValue(this.data.replicaSetId);
          this.referenceIdFormGroup.get('instanceId').setValue(this.data.instanceId);
          this.filteredApps = this.helperService.appAutoHelp(
            this.appIdAuto,
            this.referenceIdFormGroup.get('appId'),
            this.data.appId
          );
          this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(
            this.replicaSetIdAuto,
            this.referenceIdFormGroup.get('replicaSetId'),
            this.data.replicaSetId
          );
          this.filteredInstances = this.helperService.instanceAutoHelp(
            this.instanceIdAuto,
            this.referenceIdFormGroup.get('instanceId'),
            this.data.instanceId
          );
          if (chart.config) {
            this.editForm.get('config').setValue(chart.config);
          }
        } else {
          this.filteredApps = this.helperService.appAutoHelp(
            this.appIdAuto,
            this.referenceIdFormGroup.get('appId'),
          );
          this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(
            this.replicaSetIdAuto,
            this.referenceIdFormGroup.get('replicaSetId'),
          );
          this.filteredInstances = this.helperService.instanceAutoHelp(
            this.instanceIdAuto,
            this.referenceIdFormGroup.get('instanceId'),
          );
        }
      })
    );

    merge(
      chartChange
    ).subscribe(_ => this.selectChart());
  }

  goBackClick(): void{
    history.back();
  }
}
