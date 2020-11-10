import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupervisordRoutingModule } from './supervisord-routing.module';
import { AdminComponent } from './admin/admin.component';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzTableModule} from 'ng-zorro-antd/table';
import {NzMessageModule} from 'ng-zorro-antd/message';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzModalModule} from 'ng-zorro-antd/modal';
import {NzTagModule} from 'ng-zorro-antd/tag';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    SupervisordRoutingModule,
    NzButtonModule,
    NzTableModule,
    NzMessageModule,
    NzIconModule,
    NzModalModule,
    NzTagModule
  ]
})
export class SupervisordModule { }
