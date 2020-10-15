import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {JobsComponent} from './jobs/jobs.component';
import {MetricsComponent} from './metrics/metrics.component';

const routes: Routes = [
  {path: '', redirectTo: 'list', pathMatch: 'full'},
  {path: 'list', component: JobsComponent},
  {path: 'metrics', component: MetricsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobRoutingModule { }
