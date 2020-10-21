import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DashboardRepository} from '../../../shared/services/dashboard-repository';
import {PrometheusDatasource} from '../../../shared/services/prometheus-datasource';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DashboardsAddComponent} from '../dashboards-add/dashboards-add.component';
import {ChartDashboardComponent} from '../chart-dashboard/chart-dashboard.component';
import {DisplayGrid, GridsterConfig, GridsterItemComponent, GridType} from 'angular-gridster2';

@Component({
  selector: 'app-dashboards-editor',
  templateUrl: './dashboards-editor.component.html',
  styleUrls: ['./dashboards-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DashboardsEditorComponent implements OnInit, AfterViewInit{

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dashboardRepository: DashboardRepository,
    private chartGetRepository: PrometheusDatasource,
    private nzMessageService: NzMessageService,
    private modal: NzModalService,
  ) { }

  @ViewChild(ChartDashboardComponent)
  private chartDashboard: ChartDashboardComponent;

  id: number = null;
  editForm = this.fb.group({
    id: [''],
    name: [''],
    displayName: [''],
    comment: [''],
    tags: [],
    config: this.fb.group({
      layout: [],
    })
  });

  dashboard: any = [];
  options: GridsterConfig;
  itemToPush: GridsterItemComponent;

  rowsAll = 2;
  tagsList = [];

  ngOnInit(): void {
    this.options = {
      gridType: GridType.VerticalFixed,
      fixedRowHeight: 48,
      displayGrid: DisplayGrid.Always,
      itemChangeCallback: (item, itemComponent) => {
        // if (this.chartDashboard) {
        //   const canvas = this.chartDashboard.echartsInstance._dom;
        //   console.log(canvas, '元素');
        //   canvas.style.height = itemComponent.height - 140 + 'px';
        // }
        const gridster = itemComponent.el;
        gridster.style.minHeight = itemComponent.height + 'px';
      },
      itemInitCallback: (item, itemComponent) => {
        const gridster = itemComponent.el;
        gridster.style.minHeight = itemComponent.height + 'px';
      },
      gridSizeChangedCallback: gridsterComponent => {
        console.log(gridsterComponent, '这个元素的宽', gridsterComponent.curColWidth);
        const width = gridsterComponent.curColWidth;
        gridsterComponent.curRowHeight = width / 1.68;
      },
      pushItems: true,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      minCols: 12,
      maxCols: 12,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1
    };
  }

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams.subscribe(v => {
      setTimeout(() => this.id = v.id);
      if (v.id) {
        this.dashboardRepository.getById(v.id).subscribe(vv => {
          this.editForm.get('id').setValue(vv.id);
          this.editForm.get('name').setValue(vv.name);
          this.editForm.get('displayName').setValue(vv.displayName);
          this.editForm.get('comment').setValue(vv.comment);
          this.editForm.get('tags').setValue(vv.tags);
          this.tagsList = vv.tags;
          this.dashboard = vv.config.layout;
          this.rowsAll = this.dashboard
            .map(item => item.rows + item.y)
            .reduce((res, item) => res < item ? item : res, 2);
        });
      }
    });
  }

  goBackClick(): void {
    history.back();
  }

  changeDashboard(): void { // 刷新所有图标 调用子组件
    if (this.chartDashboard) {
      this.chartDashboard.getDashboard(this.dashboard);
    }
  }

  onSubmit(): void {
    this.editForm.get('config').get('layout').setValue(this.dashboard);
    const value = this.editForm.value;
    (this.id ?
        this.dashboardRepository.update(value) :
        this.dashboardRepository.add(value)
    ).subscribe(newValue => {
      this.nzMessageService.success(
        this.id ? '修改成功' : '创建成功',
        { nzDuration: 3000}
      );
    }, error => {
      this.nzMessageService.error(
        this.id ? '修改失败' : '创建失败',
        {nzDuration: 3000}
      );
      console.error(error);
    });
  }

  removeItem($event: MouseEvent | TouchEvent, item): void { // 移除
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem(): void { // 新增图表弹出框
    this.modal.create({
      nzContent: DashboardsAddComponent,
      nzWidth: 500,
      nzComponentParams: {dashboardData: this.dashboard},
      nzFooter: null,
      nzClosable: false
    }).afterClose.subscribe(result => {
      if (result) {
        result = {...result, echartsOption: {}};
        this.dashboard.push({chartData: result, x: 0, y: 0, cols: 4, rows: 4});
      }
    });
  }
}
