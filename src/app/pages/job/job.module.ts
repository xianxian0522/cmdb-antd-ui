import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { JobsComponent } from './jobs/jobs.component';
import { JobViewDialogComponent } from './jobs/job-view-dialog.component';
import { JobCreateDialogComponent } from './jobs/job-create-dialog.component';
import { MetricsComponent } from './metrics/metrics.component';


@NgModule({
  declarations: [
    JobsComponent,
    JobViewDialogComponent,
    JobCreateDialogComponent,
    MetricsComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule
  ]
})
export class JobModule { }
