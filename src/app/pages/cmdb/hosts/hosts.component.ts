import {AfterViewInit, Component, EventEmitter, OnInit, Output, Type, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HostRepository} from '../../../shared/services/host-repository';
import {NzModalService} from 'ng-zorro-antd/modal';
import {HostEditDialogComponent} from './host-edit-dialog.component';
import {NzTableComponent} from 'ng-zorro-antd/table';
import {merge} from 'rxjs';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {Host} from '../../../shared/models/host';

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss']
})
export class HostsComponent extends BaseResourceComponent<Host, HostEditDialogComponent>
  implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    protected modal: NzModalService,
    protected hostRepository: HostRepository,
  ) {
    super(hostRepository, modal);
  }

  searchForm = this.fb.group({
    hostInnerip: [],
    hostOuterip: [],
    assertId: [],
    sn: [],
    state: [''],
    hostName: [],
    osType: [''],
    osName: [],
    osVersion: [],
    osBit: [''],
    mac: [],
    outerMac: []
  });
  // checked = false;
  // loading = false;
  // indeterminate = false;
  // total = 1;
  // pageSize = 10;
  // pageIndex = 1;
  // listOfData: any = [];
  // setOfCheckedId = new Set<number>();
  // @Output() refresh = new EventEmitter<void>();
  // @ViewChild(NzTableComponent) table: NzTableComponent;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // merge(this.searchForm.valueChanges, this.refresh,
    //   this.table.nzPageSizeChange,
    //   this.table.nzPageIndexChange
    // ).subscribe(_ => {
    //   this.hostRepository.queryPage(
    //     this.table.nzPageIndex - 1,
    //     this.table.nzPageSize,
    //     this.searchForm.value
    //   ).subscribe(res => {
    //     this.listOfData = res.content;
    //     this.total = res.totalElements;
    //   });
    // });
    // this.refresh.emit();
  }

  protected editDialogType(): Type<HostEditDialogComponent> {
    return HostEditDialogComponent;
  }

  stateDisplay(state: string): string {
    switch (state) {
      case 'idle':
        return '闲置';
      case 'common':
        return '正常';
      case 'fault':
        return '故障';
      case 'abandon':
        return '废弃';
      default:
        return '未知';
    }
  }

  // getData(): void {
  //   this.hostRepository.queryPage(0, 10).subscribe(res => {
  //     console.log(res, '请求的数据');
  //     this.listOfData = res.content;
  //   });
  // }

  // showCreateDialog(): void{ // 新增
  //   console.log('showCreateDialog');
  //   this.modal.create({
  //     nzTitle: '创建主机',
  //     nzContent: HostEditDialogComponent,
  //     nzComponentParams: {mode: 'create', data: {}},
  //     nzWidth: 830,
  //     nzFooter: null,
  //   }).afterClose.subscribe(res => {
  //     if (res) {
  //       this.refresh.emit();
  //     }
  //   });
  // }
  //
  // showEditDialog(ele): void{ // 修改
  //   console.log(ele, 'ele edit');
  //   this.modal.create({
  //     nzTitle: '修改主机',
  //     nzContent: HostEditDialogComponent,
  //     nzComponentParams: {mode: 'edit', data: ele},
  //     nzWidth: 830,
  //     nzFooter: null,
  //   }).afterClose.subscribe(res => {
  //     if (res) {
  //       this.refresh.emit();
  //     }
  //   });
  // }
  //
  // updateCheckedSet(id: number, checked: boolean): void {
  //   if (checked) {
  //     this.setOfCheckedId.add(id);
  //   } else {
  //     this.setOfCheckedId.delete(id);
  //   }
  // }
  // onCurrentPageDataChange(): void {
  //   this.refreshCheckedStatus();
  // }
  // refreshCheckedStatus(): void {
  //   const listOfEnabledData = this.listOfData;
  //   this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
  //   this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  // }
  // onAllChecked(checked: boolean): void {
  //   this.listOfData.forEach(({ id }) => this.updateCheckedSet(id, checked));
  //   this.refreshCheckedStatus();
  // }
  // onItemChecked(id: number, checked: boolean): void {
  //   this.updateCheckedSet(id, checked);
  //   this.refreshCheckedStatus();
  // }

}
