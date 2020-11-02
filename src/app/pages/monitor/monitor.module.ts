import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor-routing.module';
import { RulesComponent } from './rules/rules.component';
import { RuleEditorComponent } from './rule-editor/rule-editor.component';
import { DashboardsComponent } from './dashboards/dashboards.component';
import { DashboardsEditorComponent } from './dashboards-editor/dashboards-editor.component';
import { DashboardsAddComponent } from './dashboards-add/dashboards-add.component';
import { ChartsComponent } from './charts/charts.component';
import { ChartEditComponent } from './chart-edit/chart-edit.component';
import { ChartDashboardComponent } from './chart-dashboard/chart-dashboard.component';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzAutocompleteModule} from 'ng-zorro-antd/auto-complete';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzMessageServiceModule} from 'ng-zorro-antd/message';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {CodemirrorModule} from '@ctrl/ngx-codemirror';
import {NgxEchartsModule} from 'ngx-echarts';
import {GridsterModule} from 'angular-gridster2';
import {NzListModule} from 'ng-zorro-antd/list';
import { RuleEditWarningComponent } from './rule-edit-warning/rule-edit-warning.component';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzTagModule} from 'ng-zorro-antd/tag';
import {NzCodeEditorModule} from 'ng-zorro-antd/code-editor';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [
    RulesComponent,
    RuleEditorComponent,
    DashboardsComponent,
    DashboardsEditorComponent,
    DashboardsAddComponent,
    ChartsComponent,
    ChartEditComponent,
    ChartDashboardComponent,
    RuleEditWarningComponent
  ],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    NzFormModule,
    NzAutocompleteModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzModalModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    NzMessageServiceModule,
    NzSelectModule,
    NzGridModule,
    NzRadioModule,
    NzCheckboxModule,
    NzDatePickerModule,
    CodemirrorModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    GridsterModule,
    NzListModule,
    NzAlertModule,
    NzTagModule,
    NzCodeEditorModule,
    NzToolTipModule,
  ]
})
export class MonitorModule { }
