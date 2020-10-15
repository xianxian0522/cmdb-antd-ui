import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/cmdb/user'
  },
  {
    path: 'cmdb',
    data: {section: 'cmdb'},
    loadChildren: () => import('./pages/cmdb/cmdb.module').then(m => m.CmdbModule)
  },
  {
    path: 'job',
    data: {section: 'job'},
    loadChildren: () => import('./pages/job/job.module').then(m => m.JobModule)
  },
  {
    path: 'monitor',
    data: {section: 'monitor'},
    loadChildren: () => import('./pages/monitor/monitor.module').then(m => m.MonitorModule)
  },
  {
    path: '**', redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
