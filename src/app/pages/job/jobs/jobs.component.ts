import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Job} from '../../../shared/models/job';
import {FormBuilder} from '@angular/forms';
import {JobService} from '../../../shared/services/job.service';
import {NzModalService} from 'ng-zorro-antd/modal';
import {flow} from '../../../shared/stream/stream';
import {merge} from 'rxjs';
import {debounceTime, switchMap} from 'rxjs/operators';
import {JobCreateDialogComponent} from './job-create-dialog.component';
import {JobViewDialogComponent} from './job-view-dialog.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private jobService: JobService,
    private modal: NzModalService
  ) { }

  data: Job[] = [];
  listOfData = [];
  isLoadingResults = true;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();
  @Output() refresh = new EventEmitter<void>();
  filterInput = this.fb.control('');

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    flow(merge(this.refresh)
      .pipe(
        debounceTime(200),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.jobService.findJobs();
        })
      ), err => {
      this.isLoadingResults = false;
      console.error(err);
    }).subscribe(res => {
      this.isLoadingResults = false;
      this.data = res;
      this.listOfData = [...this.data];
      this.applyFilter();
    });
    this.filterInput.valueChanges
      .pipe(
        debounceTime(200)
      ).subscribe(_ => this.applyFilter());
    this.refresh.emit();
  }

  applyFilter(): void {
    this.data = this.listOfData.filter((item) => item.name.indexOf(this.filterInput.value) !== -1 ||
      item.id.indexOf(this.filterInput.value) !== -1);
  }

  updateCheckedSet(id: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(): void {
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const data = this.data;
    this.checked = data.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = data.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.data.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: string, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  showCreateDialog(): void {
    this.modal.create({
      nzContent: JobCreateDialogComponent,
      nzWidth: 830,
      // nzComponentParams: {data: {infinite: false, jobType: 'cmd'}},
      nzFooter: null
    }).afterClose.subscribe(_ => {
      this.refresh.emit();
    });
  }
  showViewDialog(element): void {
    this.modal.create({
      nzContent: JobViewDialogComponent,
      nzWidth: '80vw',
      nzComponentParams: {data: element},
      nzFooter: null
    }).afterClose.subscribe(_ => {
      this.refresh.emit();
    });
  }
}
