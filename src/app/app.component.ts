import {Component, OnInit} from '@angular/core';
import {MenuItem, MenuItems} from './shared/menu-items';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(
    private  menuItems: MenuItems,
    private location: Location,
  ) {}

  isCollapsed = false;
  section: string;
  sections: MenuItem[];
  sectionItem: MenuItem[];

  isPc: boolean;

  ngOnInit(): void {
    this.isMobile();
    this.sections = this.menuItems.getAllSections();
    this.location.onUrlChange((url, state) => {
      console.log('url: ', url, 'state: ', state);
      this.section = url.split('/')[1];
      this.sectionItem = this.menuItems.getItems(this.section);
      console.log(this.section, 'section');
    });
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

  // get sections(): MenuItem[] {
  //   return this.menuItems.getAllSections();
  // }
}
