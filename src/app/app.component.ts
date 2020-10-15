import {Component, OnInit} from '@angular/core';
import {MenuItem, MenuItems} from './shared/menu-items';
import {ActivatedRoute, Params} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
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

  ngOnInit(): void {
    this.sections = this.menuItems.getAllSections();
    this.location.onUrlChange((url, state) => {
      console.log('url: ', url, 'state: ', state);
      this.section = url.split('/')[1];
      this.sectionItem = this.menuItems.getItems(this.section);
    });
  }

  // get sections(): MenuItem[] {
  //   return this.menuItems.getAllSections();
  // }
}
