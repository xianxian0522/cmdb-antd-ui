import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {JobService} from '../../../shared/services/job.service';
import {flow} from '../../../shared/stream/stream';
import {debounceTime, map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.scss']
})
export class MetricsComponent implements OnInit, AfterViewInit {

  constructor(
    private jobService: JobService
  ) { }

  data = [];
  isLoadingResults = true;

  @Output() refresh = new EventEmitter<void>();

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    flow(this.refresh.pipe(
      debounceTime(200),
      switchMap(() => {
        this.isLoadingResults = true;
        return this.jobService.globalStats();
      }),
      map(gs => {
        console.log(gs);
        return gs;
      }),
      map(gs => [
        {name: '活跃工作数', value: gs.active_jobs},
        {name: '禁用工作数', value: gs.disabled_jobs},
        {name: '总工作数', value: gs.jobs},
        {name: '错误数', value: gs.error_count},
        {name: '成功数', value: gs.success_count},
        {name: '下次触发时间', value: gs.next_run_at},
        {name: '上次尝试运行时间', value: gs.last_attempted_run},
        {name: '创建时间', value: gs.created}
      ])
    ), err => {
      console.error(err);
      this.isLoadingResults = false;
      this.data = [
        {name: '活跃工作数', value: ''},
        {name: '禁用工作数', value: ''},
        {name: '总工作数', value: ''},
        {name: '错误数', value: ''},
        {name: '成功数', value: ''},
        {name: '下次触发时间', value: ''},
        {name: '上次尝试运行时间', value: ''},
        {name: '创建时间', value: ''}
      ];
    }).subscribe(data => {
      this.isLoadingResults = false;
      this.data = data;
    });
    this.refresh.emit();
  }
}
