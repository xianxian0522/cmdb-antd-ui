import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MobileComponent} from './mobile.component';
import {LoginComponent} from './pages/login/login.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/cmdb/user'
  },
  {
    path: 'alerttickets/:id', component: MobileComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '',
    loadChildren: () => import('./shared/layout/layout.component').then(m => m.LayoutComponentModule)
  },
  // {
  //   path: 'cmdb',
  //   data: {section: 'cmdb'},
  //   loadChildren: () => import('./pages/cmdb/cmdb.module').then(m => m.CmdbModule)
  // },
  // {
  //   path: 'job',
  //   data: {section: 'job'},
  //   loadChildren: () => import('./pages/job/job.module').then(m => m.JobModule)
  // },
  // {
  //   path: 'monitor',
  //   data: {section: 'monitor'},
  //   loadChildren: () => import('./pages/monitor/monitor.module').then(m => m.MonitorModule)
  // },
  {
    path: '**', redirectTo: ''
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
