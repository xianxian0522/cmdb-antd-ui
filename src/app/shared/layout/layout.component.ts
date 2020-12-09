import {Component, LOCALE_ID, NgModule, OnInit} from '@angular/core';
import {MenuItem, MenuItems} from '../menu-items';
import {Title} from '@angular/platform-browser';
import {CommonModule, Location} from '@angular/common';
import {ActivatedRoute, Router, RouterModule, Routes} from '@angular/router';
import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';
import {HttpClient} from '@angular/common/http';
import {IconsProviderModule} from '../../icons-provider.module';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {FormsModule} from '@angular/forms';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {LoginService} from '../services/login.service';
import {NzMessageModule, NzMessageService} from 'ng-zorro-antd/message';

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
    private httpClient: HttpClient,
    private loginService: LoginService,
    private messageService: NzMessageService
  ) {}

  isCollapsed = false;
  section: string;
  sections: MenuItem[];
  sectionItem: MenuItem[];

  isPc: boolean;
  userName: string;
  pageNum = 1;

  ngOnInit(): void {
    // const page = localStorage.getItem('pageNum');
    // this.pageNum = parseInt(page, 10);

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

    this.location.onUrlChange(r => {
      const t = this.sectionItem.filter(v => v.id === r.split('/')[2]).map(n => n.name)[0];
      this.titleService.setTitle(this.section.toUpperCase() + '-' + t);
    });

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

  getUserInfo(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.loginService.decode(token);
      this.userName = decodedToken.username;
      // console.log(new Date(decodedToken.exp * 1000), '解码后', new Date());
      if (new Date().getTime() > decodedToken.exp * 1000) {
        this.messageService.info('token 过期', {nzDuration: 3000})
          .onClose.subscribe(s => {
            this.userLogout();
        });
      }
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
    path: 'supervisord',
    data: {section: 'supervisord'},
    component: LayoutComponent,
    loadChildren: () => import('../../pages/supervisord/supervisord.module').then(m => m.SupervisordModule)
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
    NzDropDownModule,
    NzMessageModule
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
