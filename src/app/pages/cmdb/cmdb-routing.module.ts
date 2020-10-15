import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserComponent} from './user/user.component';
import {HostsComponent} from './hosts/hosts.component';
import {AppsComponent} from './apps/apps.component';
import {ReplicaSetsComponent} from './replica-sets/replica-sets.component';
import {InstancesComponent} from './instances/instances.component';
import {PlaybooksComponent} from './playbooks/playbooks.component';

const routes: Routes = [
  {path: '', redirectTo: 'user', pathMatch: 'full'},
  {path: 'user', component: UserComponent},
  {path: 'hosts', component: HostsComponent},
  {path: 'apps', component: AppsComponent},
  {path: 'replicasets', component: ReplicaSetsComponent},
  {path: 'instances', component: InstancesComponent},
  {path: 'playbooks', component: PlaybooksComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmdbRoutingModule { }
