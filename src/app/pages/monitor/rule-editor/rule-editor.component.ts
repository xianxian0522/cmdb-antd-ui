import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RuleRepository} from '../../../shared/services/rule-repository';
import {ChartRepository} from '../../../shared/services/chart-repository';

@Component({
  selector: 'app-rule-editor',
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent implements OnInit, AfterViewInit {

  constructor(
    private fb: FormBuilder,
    private nzModalRef: NzModalRef,
    private nzMessageService: NzMessageService,
    private ruleRepository: RuleRepository,
    private chartRepository: ChartRepository,
  ) { }

  @Input() mode;
  @Input() data;
  editForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    operation: ['', Validators.required],
    operand: [''],
    displayName: [''],
    summary: [''],
    chartId: [],
    id: []
  });
  filteredOperation: {id: string, name: string}[] = [
    {id: 'eq', name: '等于'}, {id: 'neq', name: '不等于'},
    {id: 'gt', name: '大于'}, {id: 'gte', name: '大于等于'},
    {id: 'lt', name: '小于'}, {id: 'lte', name: '小于等于'}];
  chartData = [];

  ngOnInit(): void {
    this.editForm.get('id').setValue(this.data.id);
    this.editForm.get('chartId').setValue(parseInt(this.data.chartId, 10));
    this.editForm.get('name').setValue(this.data.name);
    this.editForm.get('description').setValue(this.data.description);
    this.editForm.get('operation').setValue(this.data.operation);
    this.editForm.get('operand').setValue(this.data.operand);
    this.editForm.get('displayName').setValue(this.data.displayName);
    this.editForm.get('summary').setValue(this.data.summary);
  }

  ngAfterViewInit(): void {
    this.chartRepository.queryAll().subscribe(res => {
      this.chartData = res;
    });
  }

  onClose(): void {
    this.nzModalRef.close();
  }
  onSubmit(): void {
    const value = this.editForm.value;
    (this.mode === 'edit' ? this.ruleRepository.update(value) :
      this.ruleRepository.add(value)).subscribe(newValue => {
        this.nzMessageService.success(
          this.mode === 'edit' ? '修改成功' : '创建成功',
          {nzDuration: 3000}
        );
        this.nzModalRef.close(newValue);
    }, err => {
        this.nzMessageService.error(
          this.mode === 'edit' ? '修改失败' : '创建失败',
          {nzDuration: 3000}
        );
        this.nzModalRef.close(err);
        console.error(err);
    });
  }
}
