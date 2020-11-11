import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AdminServices, AdminSupervisordServices} from '../../../shared/services/admin-services';
import {Admin} from '../../../shared/models/admin';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {

  constructor(
    protected adminServices: AdminServices,
    private nzMessageService: NzMessageService,
    private adminSupervisordServices: AdminSupervisordServices,
    private modal: NzModalService,
  ) {}

  data: Admin[] = [];
  listOfData: Admin[] = [];
  pageSize = 10;
  isLoadingResults = true;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<string>();

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.getAllList();
  }

  // 获取所有数据
  getAllList(): void {
    this.adminServices.queryListAll().subscribe(res => {
      console.log(res);
      this.data = res;
      this.isLoadingResults = false;
    });
  }
  // 选中的几个
  getSelectPrograms(): string[] {
    const names = this.listOfData.filter(({name}) => this.setOfCheckedId.has(name)).map(n => n.name);
    return names;
  }
  // 开始运行
  startSelect(): void {
    const names = this.getSelectPrograms();
    if (names.length <= 0) {
      this.nzMessageService.warning('没选择任务', {nzDuration: 3000});
      return;
    }
    this.adminSupervisordServices.startProgram(names).subscribe(_ => {
      this.getAllList();
      this.onAllChecked(false);
    });
  }
  startProgram(name: string): void {
    this.nzMessageService.info('正在请求', {nzDuration: 3000});
    this.adminSupervisordServices.startName(name).subscribe(res => {
      if (res.success) {
        this.getAllList();
        this.nzMessageService.success('已运行', {nzDuration: 3000});
      }
    });
    // this.modal.confirm({
    //   nzTitle: `你确定要开始${name}任务？`,
    //   nzOnOk: () => {
    //   }
    // });
  }
  // 停止运行
  stopSelect(): void {
    const names = this.getSelectPrograms();
    if (names.length <= 0) {
      this.nzMessageService.warning('没选择任务', {nzDuration: 3000});
      return;
    }
    this.adminSupervisordServices.stopProgram(names).subscribe(_ => {
      this.getAllList();
      this.onAllChecked(false);
    });
  }
  stopProgram(name: string): void {
    this.modal.confirm({
      nzTitle: `你确定要停止${name}的任务`,
      nzOnOk: () => {
        this.adminSupervisordServices.stopName(name).subscribe(res => {
          if (res.success) {
            this.getAllList();
            this.nzMessageService.success('已停止', {nzDuration: 3000});
          }
        });
      }
    });
  }
  // 重新加载模块
  reloadSupervisor(): void {
    // this.adminSupervisordServices.reloadProgram().subscribe(_ => {
    //   this.getAllList();
    // });
    this.modal.confirm({
      nzTitle: '确定重新加载吗？',
      nzOnOk: () => {
        this.adminSupervisordServices.reloadProgram().subscribe(_ => {
          this.getAllList();
          this.onAllChecked(false);
        });
      }
    });
  }

  updateCheckedSet(name: string, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(name);
    } else {
      this.setOfCheckedId.delete(name);
    }
  }
  onCurrentPageDataChange(listOfData: Admin[]): void {
    this.listOfData = listOfData;
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const data = this.listOfData;
    this.checked = data.every(({ name }) => this.setOfCheckedId.has(name));
    this.indeterminate = data.some(({ name }) => this.setOfCheckedId.has(name)) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(({ name }) => this.updateCheckedSet(name, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(name: string, checked: boolean): void {
    this.updateCheckedSet(name, checked);
    this.refreshCheckedStatus();
  }

}
