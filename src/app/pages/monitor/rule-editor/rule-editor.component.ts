import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {RuleNotifiers, RuleRepository} from '../../../shared/services/rule-repository';
import {ChartRepository} from '../../../shared/services/chart-repository';
import {BehaviorSubject, of} from 'rxjs';
import {UserRepository} from '../../../shared/services/user-repository';
import {debounceTime, map, switchMap} from 'rxjs/operators';

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
    private userRepository: UserRepository,
    private ruleNotifiers: RuleNotifiers,
  ) {
    // 构造函数里重写方法
    // this.onSearch = this.debounce(200, (value) => {
    //   console.log(value);
    // });
  }

  @Input() mode;
  @Input() data;
  editForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    operation: [''],
    operand: [''],
    displayName: [''],
    summary: [''],
    chartId: [],
    id: [],
    via: [], // 报警方式
    dingtalk: [false],
    email: [false],
    targets: [], // 接收人
    mode: [''], // 有无图表的新增页面
    severity: [''], // 严重级别
  });
  isLoading = false;
  optionList: string[] = [];
  searchChange$ = new BehaviorSubject('');
  // onSearch: (value: string) => void;
  @ViewChild('selectTags') selectTags;

  filteredOperation: {id: string, name: string}[] = [
    {id: 'eq', name: '等于'}, {id: 'neq', name: '不等于'},
    {id: 'gt', name: '大于'}, {id: 'gte', name: '大于等于'},
    {id: 'lt', name: '小于'}, {id: 'lte', name: '小于等于'}];
  chartData = [];
  viaNames = [];

  ngOnInit(): void {
    this.ruleNotifiers.getNotifiersName().subscribe(names => {
      this.viaNames = names.map(name => name.name);
    });
    console.log(this.data, 'shem');
    this.editForm.get('id').setValue(this.data.id);
    this.editForm.get('chartId').setValue(parseInt(this.data.chartId, 10));
    this.editForm.get('name').setValue(this.data.name);
    this.editForm.get('description').setValue(this.data.description);
    this.editForm.get('operation').setValue(this.data.operation);
    this.editForm.get('operand').setValue(this.data.operand);
    this.editForm.get('displayName').setValue(this.data.displayName);
    this.editForm.get('summary').setValue(this.data.summary);
    this.editForm.get('severity').setValue(this.data.severity);
    this.editForm.get('via').setValue(this.data.via);
    this.editForm.get('targets').setValue(this.data.targets);
    // if (this.data.via) {
    //   this.data.via.forEach(item => {
    //     if (item === 'dingtalk') {
    //       this.editForm.get('dingtalk').setValue(true);
    //     }
    //     if (item === 'email') {
    //       this.editForm.get('email').setValue(true);
    //     }
    //   });
    // }
    this.data.chartId ? this.editForm.get('mode').setValue('normal') :
      this.editForm.get('mode').setValue(this.data.mode);
  }

  ngAfterViewInit(): void {
    this.chartRepository.queryAll().subscribe(res => {
      this.chartData = res;
    }, err => {
      console.log(err);
      this.nzMessageService.error('获取失败', {nzDuration: 3000});
    });

    // 订阅select选择框的输入值的改变
    this.selectTags.nzOnSearch.pipe(
      debounceTime(200),
      switchMap((value: string) => {
        this.isLoading = true;
        // startsWith 以什么开头的
        if (value.startsWith('@')) {
          const v = value.slice(1);
          return this.userRepository.queryAll({username: v}).pipe(
            map(users => users.map(u => '@' + u.username)));
        } else if (value.startsWith('#')) {
          return of([]);
        } else if (value.startsWith('$')) {
          return of(['$owner', '$reporter']);
        } else {
          return of([]);
        }
      })
    ).subscribe(res => {
      this.isLoading = false;
      this.optionList = res;
    });
  }

  getAllVia(): void {
    let list = [];
    this.userRepository.queryAll().subscribe(res => {
      this.isLoading = false;
      list = res.map(u => `@${u.username}`);
      list = list.concat(['$owner', '$reporter']);
      this.optionList = list;
    }, err => {
      console.log(err);
      this.nzMessageService.error('获取失败', {nzDuration: 3000});
    });
  }
  getUserName(q?): void {
    this.userRepository.queryAll(q).subscribe(res => {
      console.log(res, '获取username');
      this.isLoading = false;
      this.optionList = res.map(u => `@${u.username}`);
    }, err => {
      console.log(err);
      this.nzMessageService.error('获取失败', {nzDuration: 3000});
    });
  }

  // debounce(timeout: number, func: (value: string) => void): ((value: string) => void) {
  //   let handler: any = null;
  //   return (value) => {
  //     if (handler) {
  //       clearTimeout(handler);
  //     }
  //     handler = setTimeout(() => {
  //       func(value);
  //       handler = null;
  //     }, 200);
  //   };
  // }

  // 查询
  onSearch(value: string): void {
  //   this.isLoading = true;
  //   this.searchChange$.next(value);
  //   if (value === '@') { // 查询人
  //     this.getUserName();
  //   } else if (value === '#') {
  //     console.log('组');
  //   } else if (value === '$') {
  //     this.isLoading = false;
  //     this.optionList = ['$owner', '$reporter'];
  //   } else {
  //     // console.log(value.match(/\$/)); // 检测第一个字名是否是$
  //     if (value.match('#')) {
  //       if (value.match('#').index === 0) {
  //         console.log('zu');
  //       } else {
  //         this.getAllVia();
  //       }
  //     } else if (value.match('@')) {
  //       if (value.match('@').index === 0) {
  //         const q = value.slice(1);
  //         this.searchChange$.pipe(
  //           debounceTime(200),
  //           switchMap(() => {
  //             return this.userRepository.queryAll({username: q});
  //           })
  //         ).subscribe(res => {
  //           this.isLoading = false;
  //           this.optionList = res.map(u => `@${u.username}`);
  //         }, err => {
  //           console.log(err);
  //           this.nzMessageService.error(err.message, {nzDuration: 3000});
  //         });
  //       } else {
  //         this.getAllVia();
  //       }
  //     } else {
  //       this.getAllVia();
  //     }
  //   }
  }

  viaChange(event): void {
    console.log(event, 'shen me');
    this.editForm.get('via').setValue(event);
    // const s = event.filter(v => v.checked).map(v => v.value);
    // console.log(s);
    // // this.editForm.get('via').setValue(s);
    // console.log(this.editForm.get('email').value, this.editForm.get('dingtalk').value);
    // const via = [];
    // if (this.editForm.get('email').value) {
    //   via.push('email');
    // }
    // if (this.editForm.get('dingtalk').value) {
    //   via.push('dingtalk');
    // }
    // console.log(via);
  }
  viaIncludesName(name): boolean {
    const via = this.editForm.get('via').value;
    return via ? via.includes(name) : false;
  }

  onClose(): void {
    this.nzModalRef.close();
  }
  onSubmit(): void { // 提交
    // const via = [];
    // if (!this.editForm.get('email').value && !this.editForm.get('dingtalk').value) {
    //   this.nzMessageService.warning('至少选择一个报警方式');
    //   return;
    // }
    // if (this.editForm.get('email').value) {
    //   via.push('email');
    // }
    // if (this.editForm.get('dingtalk').value) {
    //   via.push('dingtalk');
    // }
    if (!this.editForm.get('via').value) {
      this.nzMessageService.warning('至少选择一个报警方式');
      return;
    }
    if (this.editForm.get('mode').value === 'proxy') {
      this.editForm.get('chartId').reset();
      this.editForm.get('operation').setValue('eq');
      this.editForm.get('operand').setValue('0');
    }
    // this.editForm.get('via').setValue(via);
    const value = this.editForm.value;
    console.log(value, '提交的每次');
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
