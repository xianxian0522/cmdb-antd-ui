import {AbstractControl, FormGroup} from '@angular/forms';
import {BaseRepository} from '../services/base.repository';
import {EditDialogData} from '../base-resource/base-resource.component';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Input} from '@angular/core';

export abstract class BaseEditDialogComponent<MODEL extends {id?: number}> {

  protected constructor(
    // public data: EditDialogData<MODEL>,
    protected baseRepository: BaseRepository<MODEL>,
    protected nzModalRef: NzModalRef<BaseEditDialogComponent<MODEL>>,
    protected nzMessageService: NzMessageService) {
  }

  @Input() public data: EditDialogData<MODEL>;
  isLoadingResults = false;
  editForm: FormGroup;

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

  onSubmit(): void {
    this.isLoadingResults = true;
    const value = this.genFormValue();
    (this.data.mode === 'edit' ?
      this.baseRepository.update(value) :
      this.baseRepository.add(value)).subscribe(
      newValue => {
        this.data.data = newValue;
        this.nzModalRef.close(newValue);
        this.nzMessageService.info(
          this.data.mode === 'edit' ? '修改成功' : '创建成功');
      },
      err => {
        this.nzMessageService.info(
          this.data.mode === 'edit' ? '修改失败' : '创建失败');
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
