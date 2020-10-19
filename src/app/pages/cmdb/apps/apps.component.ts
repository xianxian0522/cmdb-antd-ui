import {AfterViewInit, Component, OnInit, Type} from '@angular/core';
import {AppRepository} from '../../../shared/services/app-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {FormBuilder} from '@angular/forms';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {App} from '../../../shared/models/app';
import {AppEditDialogComponent} from './app-edit-dialog.component';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent extends BaseResourceComponent<App, AppEditDialogComponent> implements OnInit, AfterViewInit {

  constructor(
    protected appRepository: AppRepository,
    protected modal: NzModalService,
    private fb: FormBuilder
  ) {
    super(appRepository, modal);
  }

  searchForm = this.fb.group({
    name: [],
    cnName: [],
    programmingLanguage: [],
    level: [],
  });

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  protected editDialogType(): Type<AppEditDialogComponent> {
    return AppEditDialogComponent;
  }

}
