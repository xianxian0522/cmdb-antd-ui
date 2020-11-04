import {Component, LOCALE_ID, NgModule, OnInit} from '@angular/core';
import {MenuItem, MenuItems} from '../menu-items';
import {Title} from '@angular/platform-browser';
import {CommonModule, Location} from '@angular/common';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {HttpService} from '../services/httpService';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from '../services/http-interceptors';
import {IconsProviderModule} from '../../icons-provider.module';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {FormsModule} from '@angular/forms';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit{
  constructor(
    private menuItems: MenuItems,
    private location: Location,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  isCollapsed = false;
  section: string;
  sections: MenuItem[];
  sectionItem: MenuItem[];

  isPc: boolean;
  userName: string;

  ngOnInit(): void {
    this.isMobile();
    this.sections = this.menuItems.getAllSections();
    // this.location.onUrlChange((url, state) => {
    //   console.log('url: ', url, 'state: ', state);
    //   this.section = url.split('/')[1];
    //   this.sectionItem = this.menuItems.getItems(this.section);
    //   console.log(this.sectionItem, 'sectionitem');
    //   const titleName = this.sectionItem.filter(v => v.id === url.split('/')[2]).map(n => n.name)[0];
    //   // 修改当前 HTML 文档的标题
    //   this.titleService.setTitle(this.section.toUpperCase() + '-' + titleName);
    // });
    const url = this.location.path();
    this.section = url.split('/')[1];
    this.sectionItem = this.menuItems.getItems(this.section);
    const titleName = this.sectionItem.filter(v => v.id === url.split('/')[2]).map(n => n.name)[0];
    // 修改当前 HTML 文档的标题
    this.titleService.setTitle(this.section.toUpperCase() + '-' + titleName);

    this.getUserInfo();
  }

  isMobile(): void{
    // console.log(window.innerWidth);
    // let ua = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry
    // |IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i);
    // return ua;
    // console.log(navigator.platform);
    const p = navigator.platform;
    const system = {win: false, mac: false, x11: false, ipad: false};
    system.win = p.indexOf('Win') === 0;
    system.mac = p.indexOf('Mac') === 0;
    system.x11 = (p === 'X11') || (p.indexOf('Linux') === 0);
    system.ipad = (navigator.userAgent.match(/iPad/i) != null);
    // (system.win || system.mac || system.x11 || system.ipad) ? (this.isPc = true) : (this.isPc = false);
    // console.log(this.isPc);

    const ua = navigator.userAgent.toLowerCase();
    const isIos = (ua.indexOf('iphone') !== -1) || (ua.indexOf('ipad') !== -1 || ua.indexOf('android') !== -1);
    // console.log(ua);
    // isIos ? console.log('ios访问') : console.log('不是iOS访问');
    this.isPc = !isIos;
    // console.log(this.isPc);
  }

  // 退出登录
  userLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getUserInfo(): void{
    const token = localStorage.getItem('token');
    if (token) {
      this.httpClient.get<{admin?: boolean, username?: string}>('/userinfo?Authorization=' + token).subscribe(res => {
        this.userName = res.username;
      });
    }
  }
}

const routes: Routes = [
  // {
  //   path: '', pathMatch: 'full', redirectTo: '/cmdb/user'
  // },
  // {
  //   path: 'alerttickets/:id', component: MobileComponent
  // },
  {
    path: 'cmdb',
    data: {section: 'cmdb'},
    component: LayoutComponent,
    loadChildren: () => import('../../pages/cmdb/cmdb.module').then(m => m.CmdbModule)
  },
  {
    path: 'job',
    data: {section: 'job'},
    component: LayoutComponent,
    loadChildren: () => import('../../pages/job/job.module').then(m => m.JobModule)
  },
  {
    path: 'monitor',
    data: {section: 'monitor'},
    component: LayoutComponent,
    loadChildren: () => import('../../pages/monitor/monitor.module').then(m => m.MonitorModule)
  },
  {
    path: '**', component: LayoutComponent
  },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes),
    RouterModule.forChild(routes),
    CommonModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    // HttpClientModule,
    // BrowserAnimationsModule,
    NzAlertModule,
    NzIconModule,
    RouterModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  exports: [RouterModule, LayoutComponent],
  declarations: [
    LayoutComponent,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: LOCALE_ID, useValue: 'zh-Hans'},
    // HttpService,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
})
export class LayoutComponentModule {
}
