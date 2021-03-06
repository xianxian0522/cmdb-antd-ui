import {Component, OnInit, Type} from '@angular/core';
import {RuleRepository} from '../../../shared/services/rule-repository';
import {Rule} from '../../../shared/models/rule';
import {FormBuilder} from '@angular/forms';
import {BaseResourceComponent} from '../../../shared/base-resource/base-resource.component';
import {RuleEditorComponent} from '../rule-editor/rule-editor.component';
import {NzModalService} from 'ng-zorro-antd/modal';
import {RuleEditWarningComponent} from '../rule-edit-warning/rule-edit-warning.component';
import {ActivatedRoute, Router} from '@angular/router';

const filteredOperation = {
  eq: '等于',
  neq: '不等于',
  gt: '大于',
  gte: '大于等于',
  lt: '小于',
  lte: '小于等于'
};

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent extends BaseResourceComponent<Rule, RuleEditorComponent> implements OnInit {

  constructor(
    protected ruleRepository: RuleRepository,
    protected modal: NzModalService,
    private fb: FormBuilder,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
  ) {
    super(ruleRepository, modal, activatedRoute, router);
  }

  searchForm = this.fb.group({
    name: [],
    displayName: [],
  });

  // @Output() refresh = new EventEmitter<void>();

  ngOnInit(): void {
    super.ngOnInit();
  }

  getOperation(e): string {
    return filteredOperation[e];
  }

  // getRuleData(id): void {
  //   this.ruleRepository.getByChartId(id).subscribe(res => {
  //     this.ruleData = res;
  //   });
  // }

  // showCreateDialog(): void {
  //
  // }
  // showEditDialog(element): void {
  //
  // }
  showViewDialog(element): void {
    this.modal.create({
      nzContent: RuleEditWarningComponent,
      nzWidth: '80vw',
      nzFooter: null,
      nzComponentParams: {data: element},
    }).afterClose.subscribe(needRefresh => {
      if (!!needRefresh) {
        this.refresh.emit();
      }
    });
  }

  protected editDialogType(): Type<RuleEditorComponent> {
    return RuleEditorComponent;
  }
}
