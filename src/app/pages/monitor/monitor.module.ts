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


@NgModule({
  declarations: [RulesComponent, RuleEditorComponent, DashboardsComponent, DashboardsEditorComponent, DashboardsAddComponent, ChartsComponent, ChartEditComponent, ChartDashboardComponent],
  imports: [
    CommonModule,
    MonitorRoutingModule
  ]
})
export class MonitorModule { }
