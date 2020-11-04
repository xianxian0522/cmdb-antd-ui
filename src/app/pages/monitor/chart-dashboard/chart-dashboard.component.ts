import {
  AfterViewInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {PrometheusDatasource} from '../../../shared/services/prometheus-datasource';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-chart-dashboard',
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDashboardComponent implements OnInit, AfterViewInit, OnChanges {

  constructor(
    private chartGetRepository: PrometheusDatasource,
    private chartRepository: ChartRepository,
    private ref: ChangeDetectorRef,
  ) {
  }

  @Input() chartData: any = {};
  echartsOption: any = {};
  echartsMerge: any = {};
  echartsInstance: any;
  @Output() voted = new EventEmitter();
  seriesState: { isShow: boolean }[];
  seriesData: any;
  colors = [
    '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
    '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
    '#c4ccd3'
  ];

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getCharts(this.chartData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, '有无？？changes');
  }

  onChartInit(ec): void {
    this.echartsInstance = ec;
    // this.getCharts(this.chartData);
  }

  getDashboard(chartData): void {
    console.log(chartData, '没传过来吗');
    if (chartData) {
      chartData.map(chart => {
        this.getCharts(chart.chartData);
      });
    }
  }

  getCharts(chartData): void {
    if (this.echartsInstance) {
      this.echartsInstance.showLoading();
      // this.echartsInstance.clear();
      this.echartsInstance.resize();
    }
    console.log(chartData, '传过来的chartData');
    if (chartData) {
      const end = new Date().getTime() / 1000;
      const start = end - 60 * 60;
      if (!chartData.query) {
        return;
      }
      this.chartGetRepository.query(
        chartData.query,
        start,
        end,
        60
      ).subscribe(value => {
        const series = value.data.result;
        const data = series.map(v => {
          return v.values.map(s => [new Date(s[0] * 1000), s[1]]);
        });
        this.seriesData = data;
        const names = series.map(v => {
          return `${v.metric.__name__}{${Object.keys(v.metric).filter(k => k !== '__name__').sort().map(k => `${k} = ${v.metric[k]}`).join(',')}}`;
        });
        this.seriesState = data.map(v => ({isShow: true}));
        chartData.echartsOption = {
          tooltip: { // 提示信息
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
              this.seriesState.map((s, idx) => {
                if (s.isShow) {
                  const p = params.length > 1 ? params[idx] : params[0];
                  return `
<div style="width: 10px;height: 10px;display: inline-block;margin-right: 3px; background-color: ${p.color}"></div>
[${formatDate(new Date(p.data[0]), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans')}] ${p.data[1]}
`;
                } else {
                  return null;
                }
              }).filter(v => v !== null).join('<br/>')
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
            type: chartData.config.lines ? 'line' : chartData.config.bars ? 'bar' : 'scatter',
            stack: chartData.config.stack ? 'counts' : '',
            areaStyle: chartData.config.stack ? {normal: {}} : null,
            symbolSize: chartData.config.lines ? 1 : 11,
            itemStyle: {
              normal: {
                color: this.colors[i],
              },
            },
            data: s,
          })),
          animationEasing: 'elasticOut',
        };
        if (this.echartsInstance) {
          // this.echartsInstance.setOption(chartData.echartsOption);
          // this.echartsInstance.resize();
          this.echartsInstance.hideLoading();
        }
        // 变更检测 检测该组件 渲染视图
        this.ref.markForCheck();
      }, err => {
        console.error(err);
        this.echartsInstance.hideLoading();
      });
    }

  }

  showCurrentSeries(item, i): void { // 点击事件
    if (this.seriesState.every(v => v.isShow)) {
      this.seriesState = this.seriesState.map((s, index) => ({...s, isShow: i === index}));
    } else if (this.seriesState.filter((_, index) => index !== i).every(v => !v.isShow)
      && this.seriesState[i].isShow) {
      this.seriesState = this.seriesState.map((s, index) => ({...s, isShow: true}));
    } else if (!this.seriesState[i].isShow) {
      this.seriesState = this.seriesState.map((s, index) => ({...s, isShow: i === index}));
    }
    const series = this.seriesState.map((s, index) => {
      return {
        itemStyle: {opacity: s.isShow ? 1 : 0},
        lineStyle: {opacity: s.isShow ? 1 : 0},
        data: s.isShow ? this.seriesData[index] : null,
      };
    });
    this.echartsMerge = {series};
  }

  unhighlightCurrentSeries(item, i): void { // 移出事件
    if (this.seriesState.every(v => v.isShow)) {
      const series = this.seriesState.map((s, index) => {
        return {
          itemStyle: {opacity: 1},
          lineStyle: {opacity: 1}
        };
      });
      this.echartsMerge = {series};
    }
  }

  highlightCurrentSeries(item, i): void { // 鼠标进入事件
    if (this.seriesState.every(v => v.isShow)) {
      const series = this.seriesState.map((s, index) => {
        return {
          itemStyle: {opacity: i === index ? 1 : 0.25},
          lineStyle: {opacity: i === index ? 1 : 0.25},
        };
      });
      this.echartsMerge = {series};
    }
  }

}
