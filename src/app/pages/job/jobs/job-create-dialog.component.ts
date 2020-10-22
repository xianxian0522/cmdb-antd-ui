import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Observable} from 'rxjs';
import {Playbook} from '../../../shared/models/playbook';
import {NzAutocompleteComponent} from 'ng-zorro-antd/auto-complete';
import {RepositoryHelperService} from '../../../shared/services/repository-helper.service';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {JobService} from '../../../shared/services/job.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Job} from '../../../shared/models/job';

@Component({
  selector: 'app-job-create-dialog',
  templateUrl: './job-create-dialog.component.html',
  styleUrls: ['./job-create-dialog.component.scss']
})
export class JobCreateDialogComponent implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private helperService: RepositoryHelperService,
    private nzModalRef: NzModalRef,
    private jobService: JobService,
    private nzMessageService: NzMessageService,
  ) { }

  editForm = this.fb.group({
    name: ['', Validators.required],
    infinite: [false],
    repeat: [''],
    startTime: [''],
    interval: [''],
    retries: [''],
    epsilon: [''],
    resumeAtNextScheduledTime: [false],
    jobType: ['cmd', Validators.required],
    playbookId: [],
    command: ['']
  });
  filteredPlaybooks: Observable<Playbook[]>;
  @ViewChild('playbookIdAuto') playbookIdAuto: NzAutocompleteComponent;

  ngOnInit(): void {

  }

  handleEndOpenChange(event): void {
    console.log(JSON.stringify(this.editForm.get('startTime').value));
  }

  onClose(): void {
    this.nzModalRef.close();
  }
  onSubmit(): void{
    const value = this.editForm.value;
    const job: Job = {
      name: value.name,
      retries: value.retries,
      epsilon: value.epsilon,
      resume_at_next_scheduled_time: value.resumeAtNextScheduledTime,
      type: value.jobType,
    };
    let schedule = 'R';
    if (!value.infinite) {
      schedule = schedule + value.repeat;
    }
    schedule = schedule + '/';
    schedule = schedule + JSON.stringify(value.startTime).slice(1, -1);
    schedule = schedule + '/';
    schedule = schedule + value.interval;
    job.schedule = schedule;
    if (job.type !== 'playbook') {
      job.command = value.command;
    } else {
      job.playbook_id = value.playbookId;
    }
    this.jobService.addJob(job).subscribe(
      () => {
        this.nzMessageService.success(
          '创建成功',
          {nzDuration: 3000}
        );
        this.nzModalRef.close();
      }, err => {
        this.nzMessageService.error(
          '创建失败',
          {nzDuration: 3000}
        );
        console.error(err);
      });
  }

  ngAfterViewInit(): void {
    this.filteredPlaybooks = this.helperService.playbookAutoHelp(this.playbookIdAuto,
      this.editForm.get('playbookId'));
  }
}
