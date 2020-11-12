import {AfterViewInit, Component, OnInit, Type, ViewChild} from '@angular/core';
import {PlaybookRepository} from '../../../shared/services/playbook-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {Router} from '@angular/router';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {Playbook} from '../../../shared/models/playbook';
import {PlaybookEditDialogComponent} from './playbook-edit-dialog.component';
import {Observable} from 'rxjs';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {App} from '../../../shared/models/app';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {Instance} from '../../../shared/models/instance';
import {PlaybookRunDialogComponent} from './playbook-run-dialog.component';

@Component({
  selector: 'app-playbooks',
  templateUrl: './playbooks.component.html',
  styleUrls: ['./playbooks.component.scss']
})
export class PlaybooksComponent extends BaseResourceComponent<Playbook, PlaybookEditDialogComponent>
  implements OnInit, AfterViewInit {

  constructor(
    protected playbookRepository: PlaybookRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
    private router: Router
  ) {
    super(playbookRepository, modal);
  }

  filteredApps: Observable<App[]>;
  @ViewChild('auto') appIdAuto: NzAutocompleteComponent;
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
    this.filteredReplicaSets = this.helperService.replicaSetAutoHelp(this.replicaSetIdAuto,
      this.searchForm.get('replicaSetId'));
    this.filteredInstances = this.helperService.instanceAutoHelp(this.instanceIdAuto, this.searchForm.get('instanceId'));
  }

  protected editDialogType(): Type<PlaybookEditDialogComponent> {
    return PlaybookEditDialogComponent;
  }

  showEditDialog(row: Playbook): void {
    const record = {...row};
    this.modal.create({
      nzContent: this.editDialogType(),
      nzFooter: null,
      nzComponentParams: {mode: 'edit', data: record},
      nzWidth: '80vw',
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }
  showCreateDialog(): void {
    this.modal.create({
      nzContent: this.editDialogType(),
      nzComponentParams: {mode: 'create', data: {}},
      nzFooter: null,
      nzWidth: '80vw',
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }

  showRunDialog(row): void{
    this.modal.create({
      nzContent: PlaybookRunDialogComponent,
      nzFooter: null,
      nzComponentParams: {data: row},
      nzWidth: '80vw',
    });
  }
}
