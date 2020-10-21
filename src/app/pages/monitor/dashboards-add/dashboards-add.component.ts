import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dashboards-add',
  templateUrl: './dashboards-add.component.html',
  styleUrls: ['./dashboards-add.component.scss']
})
export class DashboardsAddComponent implements OnInit, AfterViewInit {

  constructor(
    private chartRepository: ChartRepository,
    private nzModalRef: NzModalRef,
  ) { }

  @Input() dashboardData;
  chartList: {}[];

  ngOnInit(): void {
    console.log(this.dashboardData);
  }

  ngAfterViewInit(): void {
    this.chartRepository.queryAll().subscribe(res => {
      this.chartList = res;
    });
  }

  selectList(e): void {
    this.nzModalRef.close(e);
  }
}
