import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {RulesComponent} from './rules/rules.component';
import {ChartsComponent} from './charts/charts.component';
import {ChartEditComponent} from './chart-edit/chart-edit.component';
import {DashboardsComponent} from './dashboards/dashboards.component';
import {DashboardsEditorComponent} from './dashboards-editor/dashboards-editor.component';
import {RuleEditWarningComponent} from './rule-edit-warning/rule-edit-warning.component';

const routes: Routes = [
  {path: '', redirectTo: 'rules', pathMatch: 'full'},
  {path: 'rules', component: RulesComponent},
  {path: 'rules/warning/:id', component: RuleEditWarningComponent},
  {path: 'charts', component: ChartsComponent},
  {path: 'charts/edit', component: ChartEditComponent},
  {path: 'dashboards', component: DashboardsComponent},
  {path: 'dashboards/edit', component: DashboardsEditorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
