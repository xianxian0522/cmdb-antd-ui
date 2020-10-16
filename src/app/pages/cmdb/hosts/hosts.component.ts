import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {HostRepository} from '../../../shared/services/host-repository';

@Component({
  selector: 'app-hosts',
  templateUrl: './hosts.component.html',
  styleUrls: ['./hosts.component.scss']
})
export class HostsComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    protected hostRepository: HostRepository,
  ) { }

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
  checked = false;
  loading = false;
  indeterminate = false;
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  listOfData: any = [];
  setOfCheckedId = new Set<number>();
  @Output() refresh = new EventEmitter<void>();

  ngOnInit(): void {
    this.hostRepository.queryPage(0, 5).subscribe(res => {
      console.log(res, '请求的数据');
      this.listOfData = res.content;
    });
  }

  showCreateDialog(): void{
    console.log('showCreateDialog');
  }

  showEditDialog(ele): void{
    console.log(ele, 'ele edit');
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  onCurrentPageDataChange(): void {
    this.refreshCheckedStatus();
  }
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfData;
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  onAllChecked(checked: boolean): void {
    this.listOfData.forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

}
