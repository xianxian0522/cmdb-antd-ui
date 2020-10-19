import {AfterViewInit, Component, OnInit, Type, ViewChild} from '@angular/core';
import {ReplicaSetRepository} from '../../../shared/services/replica-set-repository';
import {FormBuilder} from '@angular/forms';
import {NzModalService} from 'ng-zorro-antd/modal';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {ReplicaSetEditDialogComponent} from './replica-set-edit-dialog.component';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {Observable} from 'rxjs';
import {App} from '../../../shared/models/app';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {AppRepository} from '../../../shared/services/app-repository';

@Component({
  selector: 'app-replica-sets',
  templateUrl: './replica-sets.component.html',
  styleUrls: ['./replica-sets.component.scss']
})
export class ReplicaSetsComponent extends BaseResourceComponent<ReplicaSet, ReplicaSetEditDialogComponent>
  implements OnInit, AfterViewInit {

  constructor(
    protected replicaSetRepository: ReplicaSetRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
    private app: AppRepository,
  ) {
    super(replicaSetRepository, modal);
  }

  filteredApps: Observable<App[]>;
  @ViewChild('auto') appIdAuto: NzAutocompleteComponent;

  searchForm = this.fb.group({
    name: [],
    appId: [],
  });

  ngOnInit(): void {
  }

  compareFun(): any{
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    this.filteredApps = this.helperService.appAutoHelp(this.appIdAuto, this.searchForm.get('appId'));
    // this.app.queryAll().subscribe(res => {
    //   const fn = res.filter(x => x.id === this.searchForm.get('appId').value).map(x => x.name);
    //   console.log(fn);
    // });
  }

  protected editDialogType(): Type<ReplicaSetEditDialogComponent> {
    return ReplicaSetEditDialogComponent;
  }
}
