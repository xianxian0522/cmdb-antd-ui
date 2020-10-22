import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {JobService} from '../../../shared/services/job.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {flow} from '../../../shared/stream/stream';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-job-view-dialog',
  templateUrl: './job-view-dialog.component.html',
  styleUrls: ['./job-view-dialog.component.scss']
})
export class JobViewDialogComponent implements OnInit, AfterViewInit {

  constructor(
    private nzModalRef: NzModalRef,
    private jobService: JobService,
    private nzMessageService: NzMessageService,
  ) { }

  @Input() data;
  @Output() trigger = new EventEmitter<string>();
  isLoadingResults = false;

  get code(): string {
    return JSON.stringify(this.data, null, 2);
  }

  ngOnInit(): void {
    console.log(this.data);
  }

  ngAfterViewInit(): void {
    flow(this.trigger.pipe(
      switchMap(event => {
        this.isLoadingResults = true;
        switch (event) {
          case 'enable':
            return this.jobService.enableJob(this.data.id);
          case 'disable':
            return this.jobService.disableJob(this.data.id);
          case 'start':
            return this.jobService.startJob(this.data.id);
        }
      }),
      switchMap(() => {
        return this.jobService.getJob(this.data.id);
      })
    ), err => {
      console.error(err);
      this.isLoadingResults = false;
      this.nzMessageService.error(
        '操作失败',
        {nzDuration: 3000}
      );
    }).subscribe(res => {
      this.data = res;
      this.isLoadingResults = false;
    });
  }

  onDeleteClick(): void { // 删除
    this.jobService.deleteJob(this.data.id)
      .subscribe(() => this.nzModalRef.close(), err => {
        console.error(err);
        this.nzMessageService.error(
          '操作失败',
          {nzDuration: 3000}
        );
      });
  }
  onCancelClick(): void {
    this.nzModalRef.close();
  }
}
