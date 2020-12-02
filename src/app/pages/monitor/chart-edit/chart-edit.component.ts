import {AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {merge, Observable, of} from 'rxjs';
import {Chart} from '../../../shared/models/chart';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {App} from '../../../shared/models/app';
import {ReplicaSet} from '../../../shared/models/replica-set';
import {Instance} from '../../../shared/models/instance';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import 'codemirror/mode/javascript/javascript';
import {PrometheusDatasource} from '../../../shared/services/prometheus-datasource';
import {formatDate} from '@angular/common';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Rule} from '../../../shared/models/rule';
import {RuleRepository} from '../../../shared/services/rule-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RuleEditorComponent} from '../rule-editor/rule-editor.component';

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

const filteredOperation = {
  eq: '等于',
  neq: '不等于',
  gt: '大于',
  gte: '大于等于',
  lt: '小于',
  lte: '小于等于'
};

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
    private helperService: RepositoryHelperService,
    private chartGetRepository: PrometheusDatasource,
    private nzMessageService: NzMessageService,
    private ruleRepository: RuleRepository,
    private modal: NzModalService,
    private router: Router,
  ) {
    Object.assign(this, {
      multi: this.multi,
      bubbleData: this.bubbleData,
    });
  }

  id: number = null;
  data: Data;
  isReadOnly: boolean;

  @Output() refresh = new EventEmitter<void>();

  @ViewChild('appIdAuto') appIdAuto: NzAutocompleteComponent;
  filteredApps: Observable<App[]>;
  @ViewChild('replicaSetIdAuto') replicaSetIdAuto: NzAutocompleteComponent;
  filteredReplicaSets: Observable<ReplicaSet[]>;
  @ViewChild('instanceIdAuto') instanceIdAuto: NzAutocompleteComponent;
  filteredInstances: Observable<Instance[]>;

  ruleData: Rule; // 规则
  // code参数
  options = {
    theme: 'idea',
    mode: 'javascript',
    lineNumbers: false, // 显示行号
    styleActiveLine: true, // 当前行背景高亮
    lineWrapping: true, // 自动换行
  };
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

  // 查询条件
  stepTime = new FormControl('1h');
  stepTimes: string[] = ['10s', '1m', '5m', '15m', '30m',
    '1h', '2h', '6h', '12h', '1d', '2d', '1w'];
  startTime = new FormControl(new Date(), [Validators.required]);
  step = new FormControl(60, {updateOn: 'blur'});

  // echarts配置
  echartsOption: any = {};
  echartsMerge: any = {};
  echartInstance: any;
  colors = [
    '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
    '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
    '#c4ccd3'
  ];
  dataSeries: [Date, string][][];
  seriesState: { isShow: boolean }[];

  referenceIdFormGroup = this.editForm.get('referenceId');


  // ngx-charts 配置option
  chartType: any;
  // lines的数据
  multi: any[] = [];
  // bars的数据
  bubbleData: any[] = [];
  view: any[] = [700, 300];
  // legend: boolean = true;
  // showLabels: boolean = true;
  // animations: boolean = true;
  // xAxis: boolean = true;
  // yAxis: boolean = true;
  // showYAxisLabel: boolean = true;
  // showXAxisLabel: boolean = true;
  // timeline去掉charts下面的时间推移显示的图
  // timeline: boolean = true;
  colorScheme = {
    domain: ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
      '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
  };
  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    const result = this.multi.filter(n => n.name === JSON.parse(JSON.stringify(data)));
    console.log(result, 'you ji ge');
  }
  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }
  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }


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

  onChartInit(ec): void {
    this.echartInstance = ec;
    this.refresh.emit();
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
    if (this.seriesState) {
      const series = this.seriesState.map(v => {
        return stack ? {
          stack: 'counts',
          areaStyle: {normal: {}},
        } : {
          stack: '',
          areaStyle: null,
        };
      });
      this.echartsMerge = {series};
    }
  }

  handleStartOpenChange(e): void {
    console.log(e);
  }

  timeChange(i): void {
    let time = this.startTime.value.getTime();
    time = time + i * this.getStepTime() * 1000;
    this.startTime.setValue(new Date(time));
  }

  getStepTime(): number {
    const t = this.stepTime.value.slice(-1);
    const n = parseInt(this.stepTime.value.slice(0, -1), 10);
    if (t === 's') {
      return n;
    } else if (t === 'm') {
      return n * 60;
    } else if (t === 'h') {
      return n * 60 * 60;
    } else if (t === 'd') {
      return n * 24 * 60 * 60;
    } else if (t === 'w') {
      return n * 7 * 24 * 60 * 60;
    }
  }

  selectChart(): void {
    if (this.echartInstance && this.id) {
      this.echartInstance.showLoading();
    }
    let query = this.editForm.get('query').value;
    query = query.replace(/\n/g, '');
    if (!query) {
      return;
    }
    const start = this.startTime.value / 1000 - this.getStepTime();
    const end = this.startTime.value / 1000;
    const step = this.step.value;
    const config = this.editForm.get('config');
    this.chartGetRepository.query(
      query,
      start,
      end,
      step
    ).subscribe(value => {
      const series = value.data.result;
      const colors = this.colors;
      if (series.length > colors.length) {
        const num = series.length - colors.length;
        for (let i = 0; i < num; i++) {
          this.colors.push(colors[i]);
        }
      }
      const data = series.map(s => {
        // as声明什么类型
        return s.values.map(e => [new Date(e[0] * 1000), e[1]] as [Date, string]);
      });
      this.dataSeries = data;
      const names = series.map(s => {
        const m = s.metric.__name__ ? s.metric.__name__ : '';
        return `${m}{${Object.keys(s.metric).filter(k => k !== '__name__').sort().map(k => `${k}="${s.metric[k]}"`).join(',')}}`;
      });

      // ngx-charts的results lines的数据
      this.multi = data.map((s, i) => ({
        name: names[i],
        series: s.map(ss => ({
          name: ss[0],
          // name: formatDate(new Date(ss[0]), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans'),
          value: parseFloat(ss[1]),
        }))
      }));
      this.chartType = config.get('lines').value ? 'lines' : config.get('bars').value ? 'bars' : 'points';
      // points的数据
      this.bubbleData = data.map((s, i) => ({
        name: names[i],
        series: s.map(ss => ({
          name: ss[0],
          x: ss[0],
          y: ss[1],
          r: 5
        }))
      }));

      this.echartsOption = {
        tooltip: {   // 提示信息
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            animation: false,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: params =>
            // this.seriesState.map((s, idx) => {
            params.map(p => {
              // if (s.isShow) {
                // const p = params.length > 1 ? params[idx] : params[0];
                const c = p ? p.color : '';
                const d = p ? [formatDate(new Date(p.data[0]), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans')] : '';
                const d1 = p ? p.data[1] : '';
                if (d) {
                  return `<div style="width: 10px;height: 10px;display: inline-block;margin-right: 3px; background-color: ${c}"></div>${d} ${d1}`;
                } else {
                  return null;
                }
              // } else {
              //   return null;
              // }
            }).filter(x => x !== null).join('<br/>')
        },
        xAxis: {
          type: 'time',
          silent: false,
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          scale: true
        },
        series: data.map((s, i) => ({
          name: names[i],
          type: config.get('lines').value ? 'line' : config.get('bars').value ? 'bar' : 'scatter',
          stack: config.get('stack').value ? 'counts' : '',
          areaStyle: config.get('stack').value ? {normal: {}} : null,
          itemStyle: {
            normal: {
              color: this.colors[i],
            },
          },
          symbolSize: config.get('lines').value ? 1 : 8,
          data: s,
        })),
        animationEasing: 'elasticOut',
      };
      this.seriesState = data.map(_ => ({isShow: true}));
      if (this.echartInstance) {
        this.echartInstance.hideLoading();
      }
    }, err => {
      console.error(err);
      this.echartInstance.hideLoading();
      this.nzMessageService.error(err.message, {nzDuration: 3000});
    });
  }

  onSubmit(): void { // 新增或者提交
    const value = this.genFormValue();
    (this.id ?
      this.chartRepository.update(value) :
      this.chartRepository.add(value)).subscribe(
      newValue => {
        this.data = newValue;
        this.nzMessageService.success(
          this.id ? '修改成功' : '创建成功',
          {nzDuration: 3000}
        ).onClose.subscribe(c => {
          this.router.navigate(['../edit'], { queryParams: { id: newValue.id },
            relativeTo: this.activatedRoute});
        });
      },
      err => {
        this.nzMessageService.error(
          this.id ? '修改失败' : '创建失败',
          {nzDuration: 3000}
        );
        console.error(err);
      }
    );
  }

  ngAfterViewInit(): void {
    const chartChange = this.activatedRoute.queryParams.pipe(
      switchMap(params => {
        setTimeout(() => params.isReadOnly ? this.isReadOnly = true : this.isReadOnly = false);
        return params.id ? this.chartRepository.getById(params.id) : of(null);
      }),
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
          this.getRuleData(chart.id);
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
      chartChange,
      this.refresh,
      this.step.valueChanges,
      this.stepTime.valueChanges,
      this.startTime.valueChanges,
      this.editForm.get('config').valueChanges
    ).subscribe(_ => this.selectChart());
  }

  getRuleData(id): void {
    this.ruleRepository.getByChartId(id).subscribe(res => {
      this.ruleData = res;
    }, err => {
      console.error(err);
      this.nzMessageService.error('获取失败', {nzDuration: 3000});
    });
  }

  goBackClick(): void {
    history.back();
  }

  highlightCurrentSeries(item: any, index: number): void {
    if (this.seriesState.every(s => s.isShow)) {
      const series = this.seriesState.map((s, idx) => {
        return {
          itemStyle: {opacity: idx === index ? 1 : 0.25},
          lineStyle: {opacity: idx === index ? 1 : 0.25}
        };
      });
      this.echartsMerge = {series};
    }
  }

  unhighlightCurrentSeries(item: any, index: number): void {
    if (this.seriesState.every(s => s.isShow)) {
      const series = this.seriesState.map((s, idx) => {
        return {
          itemStyle: {opacity: 1},
          lineStyle: {opacity: 1}
        };
      });
      this.echartsMerge = {series};
    }
  }

  showCurrentSeries(item: any, index: number): void {
    if (this.seriesState.every(s => s.isShow)) {
      this.seriesState = this.seriesState.map((s, idx) => ({...s, isShow: idx === index}));
    } else if (this.seriesState[index].isShow &&
      this.seriesState.filter((_, idx) => idx !== index).every(s => !s.isShow)) {
      this.seriesState = this.seriesState.map(s => ({...s, isShow: true}));
    } else if (!this.seriesState[index].isShow) {
      this.seriesState = this.seriesState.map((s, idx) => ({...s, isShow: idx === index}));
    }

    const series = this.seriesState.map((s, ind) => {
      return {
        itemStyle: {opacity: s.isShow ? 1 : 0}, lineStyle: {opacity: s.isShow ? 1 : 0},
        data: s.isShow ? this.dataSeries[ind] : null,
      };
    });

    this.echartsMerge = {series};
  }

  showEditDialog(element): void {
    this.modal.create({
      nzContent: RuleEditorComponent,
      nzComponentParams: {mode: 'edit', data: element},
      nzWidth: 880,
      nzFooter: null
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.getRuleData(this.id);
      }
    });
  }

  showCreateDialog(): void {
    this.modal.create({
      nzContent: RuleEditorComponent,
      nzComponentParams: {mode: 'create', data: {chartId: this.id}},
      nzWidth: 880,
      nzFooter: null
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.getRuleData(this.id);
      }
    });
  }

  getOperation(e): string {
    return filteredOperation[e];
  }
}
