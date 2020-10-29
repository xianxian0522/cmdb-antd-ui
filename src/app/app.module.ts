import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {IconsProviderModule} from './icons-provider.module';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import zh from '@angular/common/locales/zh';
import {MobileComponent} from './mobile.component';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzIconModule} from 'ng-zorro-antd/icon';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MobileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzAlertModule,
    NzIconModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: LOCALE_ID, useValue: 'zh-Hans'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
