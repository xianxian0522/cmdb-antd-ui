import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JobRoutingModule } from './job-routing.module';
import { JobsComponent } from './jobs/jobs.component';
import { JobViewDialogComponent } from './jobs/job-view-dialog.component';
import { JobCreateDialogComponent } from './jobs/job-create-dialog.component';
import { MetricsComponent } from './metrics/metrics.component';
import {NzTableModule} from 'ng-zorro-antd/table';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzSpinModule} from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    JobsComponent,
    JobViewDialogComponent,
    JobCreateDialogComponent,
    MetricsComponent
  ],
  imports: [
    CommonModule,
    JobRoutingModule,
    NzTableModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzModalModule,
    NzFormModule,
    NzIconModule,
    NzButtonModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzRadioModule,
    NzAutocompleteModule,
    NzMessageModule,
    NzTagModule,
    NzSpinModule
  ]
})
export class JobModule { }
