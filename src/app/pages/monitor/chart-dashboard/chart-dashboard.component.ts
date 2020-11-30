import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
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

  @Output() refresh = new EventEmitter<number>();
  @Input() chartDataID: any = {};
  @Input() index: number;
  echartsOption: any = {};
  echartsMerge: any = {};
  echartsInstance: any;
  @Output() voted = new EventEmitter();
  state: { isShow: boolean }[];
  seriesData: any = [];
  optionSeries: any = []; // 保存多个options里面的series
  optionsEcharts: any = []; // 保存多个echartsOption
  optionState: any = []; // 保存多个seriesState状态
  colors = [
    '#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae',
    '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570',
    '#c4ccd3'
  ];
  @ViewChild('echartId') echartId;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.refresh.subscribe((x) => {
      console.log(x);
      this.getCharts(this.chartDataID.id);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onChartInit(ec): void {
    this.echartsInstance = ec;
    // this.refresh.emit();
  }

  getCharts(chartDataID, index?): void {
    if (this.echartsInstance) {
      this.echartsInstance.showLoading();
      this.echartsInstance.resize();
    }
    this.chartRepository.getById(chartDataID).subscribe(chartData => {
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
          const colors = this.colors;
          if (series.length > colors.length) {
            const num = series.length - colors.length;
            for (let i = 0; i < num; i++) {
              this.colors.push(colors[i]);
            }
          }
          const data = series.map(v => {
            return v.values.map(s => [new Date(s[0] * 1000), s[1]]);
          });
          // this.seriesData = data;
          const names = series.map(v => {
            const m = v.metric.__name__ ? v.metric.__name__ : '';
            return `${m}{${Object.keys(v.metric).filter(k => k !== '__name__').sort().map(k => `${k} = ${v.metric[k]}`).join(',')}}`;
          });
          // this.seriesState = data.map(v => ({isShow: true}));
          // 放入chartData里面 每个点击事件以及鼠标事件都是单独的seriesState 不会出现都只是第一个的数据
          this.state = data.map(v => ({isShow: true}));
          const ix = index ? index : this.index;
          this.seriesData.splice(ix, 1, data);
          this.echartsOption = {
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
              textStyle: {
                fontSize: 12,
              },
              enterable: true, // 鼠标可以进入悬浮框
              extraCssText: 'overflow-y: scroll; max-height: 90%;',
              hideDelay: 1000, // 延迟浮层隐藏
              position: (pos, params, dom, rect, size) => {
                let obj;
                if (params.length > 8) {
                  obj = {top: 30};
                } else {
                  obj = {top: 60};
                }
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                return obj;
              },
              formatter: params =>
                // chartData.seriesState.map((s, idx) => {
                params.map(p => {
                  // if (s.isShow) {
                  //   const p = params.length > 1 ? params[idx] : params[0];
                  const c = p ? p.color : '';
                  const d = p ? [formatDate(new Date(p.data[0]), 'yyyy-MM-dd HH:mm:ss', 'zh-Hans')] : '';
                  const d1 = p ? p.data[1] : '';
                  if (d) {
                    return `<div style="width: 8px;height: 8px;display: inline-block;margin-right: 3px; background-color: ${c}"></div>${d} ${d1}`;
                  } else {
                    return null;
                  }
                  // } else {
                  //   return null;
                  // }
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
              symbolSize: chartData.config.lines ? 1 : 8,
              itemStyle: {
                normal: {
                  color: this.colors[i],
                },
              },
              data: s,
            })),
            animationEasing: 'elasticOut',
          };
          this.optionSeries[ix] = this.echartsOption.series;
          this.optionSeries = [...this.optionSeries];
          // this.optionSeries.splice(ix, 1, this.echartsOption.series);
          this.optionsEcharts[ix] = this.echartsOption;
          this.optionsEcharts = [...this.optionsEcharts];
          // this.optionsEcharts.splice(ix, 1, this.echartsOption);
          this.optionState[ix] = this.state;
          this.optionState = [...this.optionState];
          // this.optionState.splice(ix, 1, this.state);
          if (this.echartsInstance) {
            this.echartsInstance.resize();
            this.echartsInstance.hideLoading();
            this.echartsInstance.setOption(this.echartsOption, true);
          }
          // 变更检测 检测该组件 渲染视图
          this.ref.markForCheck();
        }, err => {
          this.echartsInstance.hideLoading();
        });
      }

    });
  }

  showCurrentSeries(item, i): void { // 点击事件
    if (this.optionState[this.index].every(v => v.isShow)) {
      this.optionState[this.index] = this.optionState[this.index].map((s, index) => ({...s, isShow: i === index}));
    } else if (this.optionState[this.index].filter((_, index) => index !== i).every(v => !v.isShow)
      && this.optionState[this.index][i].isShow) {
      this.optionState[this.index] = this.optionState[this.index].map((s, index) => ({...s, isShow: true}));
    } else if (!this.optionState[this.index][i].isShow) {
      this.optionState[this.index] = this.optionState[this.index].map((s, index) => ({...s, isShow: i === index}));
    }

    const series = this.optionState[this.index].map((s, index) => {
      return {
        itemStyle: {opacity: s.isShow ? 1 : 0},
        lineStyle: {opacity: s.isShow ? 1 : 0},
        data: s.isShow ? this.seriesData[this.index][index] : this.seriesData[this.index],
      };
    });
    this.echartsMerge = {series};
  }

  unhighlightCurrentSeries(item, i): void { // 移出事件
    if (this.optionState[this.index].every(v => v.isShow)) {
      const series = this.optionState[this.index].map((s, index) => {
        return {
          itemStyle: {opacity: 1},
          lineStyle: {opacity: 1}
        };
      });
      this.echartsMerge = {series};
    }
  }

  highlightCurrentSeries(item, i): void { // 鼠标进入事件
    if (this.optionState[this.index].every(v => v.isShow)) {
      const series = this.optionState[this.index].map((s, index) => {
        return {
          itemStyle: {opacity: i === index ? 1 : 0.25},
          lineStyle: {opacity: i === index ? 1 : 0.25},
        };
      });
      this.echartsMerge = {series};
    }
  }


}
