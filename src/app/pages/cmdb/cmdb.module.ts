import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmdbRoutingModule } from './cmdb-routing.module';
import { UserComponent } from './user/user.component';
import { UserDialogComponent } from './user/user-dialog.component';
import { AppsComponent } from './apps/apps.component';
import { AppEditDialogComponent } from './apps/app-edit-dialog.component';
import { HostsComponent } from './hosts/hosts.component';
import { HostEditDialogComponent } from './hosts/host-edit-dialog.component';
import { InstancesComponent } from './instances/instances.component';
import { InstanceEditDialogComponent } from './instances/instance-edit-dialog.component';
import { PlaybooksComponent } from './playbooks/playbooks.component';
import { PlaybookEditDialogComponent } from './playbooks/playbook-edit-dialog.component';
import { PlaybookRunDialogComponent } from './playbooks/playbook-run-dialog.component';
import { ReplicaSetsComponent } from './replica-sets/replica-sets.component';
import { ReplicaSetEditDialogComponent } from './replica-sets/replica-set-edit-dialog.component';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzPaginationModule} from 'ng-zorro-antd/pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [
    UserComponent,
    UserDialogComponent,
    AppsComponent,
    AppEditDialogComponent,
    HostsComponent,
    HostEditDialogComponent,
    InstancesComponent,
    InstanceEditDialogComponent,
    PlaybooksComponent,
    PlaybookEditDialogComponent,
    PlaybookRunDialogComponent,
    ReplicaSetsComponent,
    ReplicaSetEditDialogComponent
  ],
  imports: [
    CommonModule,
    CmdbRoutingModule,
    NzModalModule,
    NzPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzTableModule,
    NzIconModule,
    NzPopconfirmModule
  ]
})
export class CmdbModule { }
