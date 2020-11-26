import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RuleRepository} from '../../../shared/services/rule-repository';
import {flow} from '../../../shared/stream/stream';
import {merge} from 'rxjs';
import {debounceTime, map, switchMap} from 'rxjs/operators';
import {NzTableComponent} from 'ng-zorro-antd/table';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-rule-edit-warning',
  templateUrl: './rule-edit-warning.component.html',
  styleUrls: ['./rule-edit-warning.component.scss']
})
export class RuleEditWarningComponent implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private ruleRepository: RuleRepository,
    private activatedRoute: ActivatedRoute,
  ) { }

  @Input() data;
  ruleId: number;
  ruleData = [];
  stateData: any = [];
  stateTitle: string;
  stateBackground: number;
  backgroundColor: string;
  searchForm = this.fb.group({
    status: [],
    startTime: [],
    stopTime: [],
  });
  total = 1;
  pageSize = 10;
  pageIndex = 1;
  isLoadingResults = true;

  @Output() refresh = new EventEmitter<void>();
  @ViewChild('rowSelectionTable') table: NzTableComponent;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {  // 是否展开
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  startOnChange(event): void {
    console.log(JSON.stringify(event).slice(1, -1));
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.pipe(
      switchMap(params => {
        this.ruleId = parseInt(params.get('id'), 10);
        return this.ruleRepository.getStateByAlertId(this.ruleId);
      }),
    ).subscribe(res => {
      this.stateData = res;
      let firing = 0;
      let resolved = 0;
      this.stateData.map(item => {
        item.labels = Object.keys(item.labels).sort().map(k => `${k}=${item.labels[k]}`);
        item.status === 'firing' ? ++firing : ++resolved;
      });
      console.log(this.stateData, '当前states', firing, resolved);
      this.stateTitle = `当前状态：firing总共：${firing}，resolved总共：${resolved}`;
      // this.stateData.every(item => item.status === 'firing') ? this.stateBackground = 0 :
      //   this.stateData.every(item => item.status === 'resolved') ? this.stateBackground = 1 : this.stateBackground = 2;
      this.stateData.length === 0 ? this.backgroundColor = '#f6ffed' :
        this.stateData.every(item => item.status === 'firing') ? this.backgroundColor = '#fff2f0' :
        this.stateData.every(item => item.status === 'resolved') ? this.backgroundColor = '#f6ffed' :
          this.backgroundColor = '#fffbe6';
    });
  }

  ngAfterViewInit(): void {
    flow(merge(this.searchForm.valueChanges, this.refresh, this.table.nzPageIndexChange, this.table.nzPageSizeChange)
      .pipe(debounceTime(200),
        switchMap(() => {
          this.isLoadingResults = true;
          const value = {...this.searchForm.value};
          if (value.startTime) {
            value.startTime = JSON.stringify(value.startTime).slice(1, -1);
          }
          if (value.stopTime) {
            value.stopTime = JSON.stringify(value.stopTime).slice(1, -1);
          }
          return this.ruleRepository.getByAlertId(this.ruleId,
            this.table.nzPageIndex - 1,
            this.table.nzPageSize,
            value);
        }),
        map(data => {
          this.isLoadingResults = false;
          this.total = data.totalElements;
          return data.content;
        })
      ), err => {
      this.isLoadingResults = false;
      console.error(err);
    }).subscribe(res => {
      this.ruleData = res;
      this.ruleData.forEach(item => {
         item.labels = Object.keys(item.labels).sort().map(k => `${k}="${item.labels[k]}"`);
         item.annotations = Object.keys(item.annotations).sort().map(k => `${k}="${item.annotations[k]}"`);
      });
    });
    this.refresh.emit();
  }

}
