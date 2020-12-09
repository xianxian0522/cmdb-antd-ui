import {AfterViewInit, Component, OnInit, Type, ViewChild} from '@angular/core';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {Chart} from '../../../shared/models/chart';
import {ChartEditComponent} from '../chart-edit/chart-edit.component';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {merge, Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {Instance} from '../../../shared/models/instance';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {flow} from '../../../shared/stream/stream';
import {ActivatedRoute, Router} from '@angular/router';

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
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
    super(chartRepository, nzModalService, activatedRoute, router);
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
  observablePageIndex: Observable<number>;

  ngOnInit(): void {
    super.ngOnInit();
    // this.activatedRoute.queryParams.subscribe(url => {
    //   let pageNumber = url.pageNumber;
    //   if (!pageNumber) {
    //     pageNumber = 1;
    //   } else {
    //     pageNumber = parseInt(pageNumber, 10);
    //   }
    //   this.pageIndex = pageNumber;
    // });
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // this.table.nzPageIndexChange.subscribe(page => {
    //   console.log(page, 'you wu');
    //   const pageNum = this.table.nzPageIndex;
    //   // localStorage.setItem('pageNum', pageNum);
    //   this.router.navigate(['/monitor/charts'],
    //     { queryParams: { pageNumber: pageNum }, relativeTo: this.activatedRoute });
    // });
    // flow(merge(this.searchForm.valueChanges, this.refresh, this.table.nzPageIndexChange, this.table.nzPageSizeChange)
    //   .pipe(
    //     debounceTime(200),
    //     switchMap(() => {
    //       this.isLoadingResults = true;
    //       return this.baseRepository.queryPage(
    //         this.table.nzPageIndex - 1,
    //         this.table.nzPageSize,
    //         this.searchForm.value
    //       );
    //     }),
    //     map(data => {
    //       this.isLoadingResults = false;
    //       this.total = data.totalElements;
    //       return data.content;
    //     })), err => {
    //   this.isLoadingResults = false;
    //   console.error(err);
    // }).subscribe(data => {
    //   this.data = data;
    // });
    // this.refresh.emit();

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
