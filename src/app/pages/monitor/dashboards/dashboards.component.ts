import {AfterViewInit, Component, OnInit, Type} from '@angular/core';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {Dashboards} from '../../../shared/models/dashboards';
import {DashboardsEditorComponent} from '../dashboards-editor/dashboards-editor.component';
import {DashboardRepository} from '../../../shared/services/dashboard-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-dashboards',
  templateUrl: './dashboards.component.html',
  styleUrls: ['./dashboards.component.scss']
})
export class DashboardsComponent extends BaseResourceComponent<Dashboards, DashboardsEditorComponent>
  implements OnInit, AfterViewInit {

  constructor(
    protected dashboardRepository: DashboardRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
    super(dashboardRepository, modal, activatedRoute, router);
  }

  searchForm = this.fb.group({
    name: [],
    displayName: [],
    tags: []
  });
  listOfOption: [] = [];

  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected editDialogType(): Type<DashboardsEditorComponent> {
    return DashboardsEditorComponent;
  }
}
