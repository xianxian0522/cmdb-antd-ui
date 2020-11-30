import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {DashboardRepository} from '../../../shared/services/dashboard-repository';
import {PrometheusDatasource} from '../../../shared/services/prometheus-datasource';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {DashboardsAddComponent} from '../dashboards-add/dashboards-add.component';
import {ChartDashboardComponent} from '../chart-dashboard/chart-dashboard.component';
import {DisplayGrid, GridsterConfig, GridsterItemComponent, GridType} from 'angular-gridster2';
import * as screenfull from 'screenfull';
import {Screenfull} from 'screenfull';
import {map, switchMap} from 'rxjs/operators';
import {merge, of} from 'rxjs';

@Component({
  selector: 'app-dashboards-editor',
  templateUrl: './dashboards-editor.component.html',
  styleUrls: ['./dashboards-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DashboardsEditorComponent implements OnInit, AfterViewInit, OnChanges{

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dashboardRepository: DashboardRepository,
    private chartGetRepository: PrometheusDatasource,
    private nzMessageService: NzMessageService,
    private modal: NzModalService,
    private ref: ChangeDetectorRef,
  ) {}

  @ViewChild(ChartDashboardComponent)
  private chartDashboard: ChartDashboardComponent;

  @ViewChild('fullScreen') fullScreen;
  isFullScreen = false;

  id: number = null;
  editForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
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

  rowsAll = 8;
  tagsList = [];
  isReadOnly: boolean;

  onClickScreenFull(): void { // 全屏
    const sf = screenfull as Screenfull;
    this.isFullScreen = true;
    console.log(this.fullScreen, sf.element, '是全屏描述');
    if (sf.isEnabled) {
      sf.toggle(this.fullScreen.nativeElement).then(r => {
        console.log(this.options.fixedRowHeight, '这元素的...');
      });
    }
  }

  onCloseScreenFull(): void { // 退出全屏
    const sf = screenfull as Screenfull;
    this.isFullScreen = false;
    console.log(sf.element, 'fei全屏模式');
    if (sf.isEnabled) {
      sf.exit().then(r => {
        console.log(this.options.fixedRowHeight, '这元素的...');
      });
    }
  }

  ngOnInit(): void {
    this.options = {
      gridType: GridType.VerticalFixed,
      margin: 2,
      fixedRowHeight: 48,
      displayGrid: DisplayGrid.Always,
      itemChangeCallback: (item, itemComponent) => {
        this.rowsAll = this.dashboard.map(t => t.rows + t.y)
          .reduce((res, tt) => res < tt ? tt : res, 0);
        console.log(this.rowsAll, '行数');
      },
      itemResizeCallback: (item, itemComponent) => {
        const targetHeight = itemComponent.gridster.curColWidth * 0.618;
        if (Math.round(Math.abs(this.options.fixedRowHeight / targetHeight - 1) * 100) !== 0) {
          this.options.fixedRowHeight = targetHeight;
          this.options.api.optionsChanged();
          console.log('set size', this.options.fixedRowHeight);
          const sf = screenfull as Screenfull;
          this.isFullScreen = sf.isFullscreen;  // 全屏还是非全屏
          this.changeDashboard();
        }
      },
      gridSizeChangedCallback: gridsterComponent => {
        // console.log(gridsterComponent, '这个元素的宽', gridsterComponent.curColWidth);
        // this.options.fixedRowHeight = gridsterComponent.curColWidth * 0.618;
        // this.options.api.optionsChanged();
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
    const paramsChange = this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        setTimeout(() => params.isReadOnly ? this.isReadOnly = true : this.isReadOnly = false);
        return params.id ? this.dashboardRepository.getById(params.id) : of(null);
      }),
      map(v => {
        if (v) {
          setTimeout(() => this.id = v.id);
          this.editForm.get('id').setValue(v.id);
          this.editForm.get('name').setValue(v.name);
          this.editForm.get('displayName').setValue(v.displayName);
          this.editForm.get('comment').setValue(v.comment);
          this.editForm.get('tags').setValue(v.tags);
          this.tagsList = v.tags;
          this.dashboard = v.config.layout;
          this.rowsAll = this.dashboard
            .map(item => item.rows + item.y)
            .reduce((res, item) => res < item ? item : res, 6);
        }
      })
    );
    merge(
      paramsChange,
    ).subscribe(_ => {
      // // 重新渲染数据 检查该视图及其子视图
      // this.ref.markForCheck();
      // this.ref.detectChanges();
      this.changeDashboard();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, 'ngchanges会变化吗');
  }

  goBackClick(): void {
    history.back();
  }

  changeDashboard(): void { // 刷新所有图标 调用子组件
    // 重新渲染数据 检查该视图及其子视图
    this.ref.markForCheck();
    this.ref.detectChanges();
    if (this.chartDashboard) {
      this.chartDashboard.getDashboard(this.dashboard);
      // this.dashboard.map(item => {
      //   this.chartDashboard.getCharts(item.chartData);
      //   console.log('调用几次？？');
      // });
      this.options.api.optionsChanged();
    } else {
      console.log('isnull');
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
        {nzDuration: 3000}
      ).onClose.subscribe(c => {
        console.log(c, 'chaungjianchengg');
      });
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
        this.dashboard.push({chartDataID: result, x: 0, y: 0, cols: 7, rows: 7});
        // this.ref.detectChanges();
        // this.ref.markForCheck();
        this.changeDashboard();
      }
    });
  }
}
