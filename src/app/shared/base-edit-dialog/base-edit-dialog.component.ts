import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseRepository} from '../services/base.repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {AfterViewInit, Component, Input} from '@angular/core';

@Component({
  selector: 'app-base-edit-dialog',
  template: ``
})
export abstract class BaseEditDialogComponent<MODEL extends {id?: number}> implements AfterViewInit {

  protected constructor(
    protected baseRepository: BaseRepository<MODEL>,
    protected nzModalRef: NzModalRef<BaseEditDialogComponent<MODEL>>,
    protected nzMessageService: NzMessageService,
  ) {
  }

  isLoadingResults = false;
  editForm: FormGroup;
  @Input() mode;
  @Input() data;

  getErrorMessage(control: AbstractControl): string {
    if (control.valid) {
      return '';
    }
    return Object.keys(control.errors).map(key => {
      const value = control.errors[key];
      switch (key) {
        case 'required':
          return '必填';
        case 'referenceId':
          return '所属应用/副本集/实例必须填写，且只能选一个';
        default:
          return `${key}: ${typeof value === 'string' ? value : JSON.stringify(value) }`;
      }
    }).join('; ');
  }

  protected genFormValue(): any {
    return this.editForm.value;
  }

  ngAfterViewInit(): void {
    console.log(this.data, this.mode, '有值吗');
  }

  onSubmit(): void {
    this.isLoadingResults = true;
    const value = this.genFormValue();
    if (this.mode === 'edit') {
      delete value.password;
    }
    (this.mode === 'edit' ?
      this.baseRepository.update(value) :
      this.baseRepository.add(value)).subscribe(
      newValue => {
        this.data = newValue;
        this.nzModalRef.close(newValue);
        this.nzMessageService.info(
          this.mode === 'edit' ? '修改成功' : '创建成功');
      },
      err => {
        this.nzMessageService.info(
          this.mode === 'edit' ? '修改失败' : '创建失败');
        console.error(err);
        this.isLoadingResults = false;
      },
      () => {
        this.isLoadingResults = false;
      }
    );
  }

  onClose(): void {
    this.nzModalRef.close();
  }
}
