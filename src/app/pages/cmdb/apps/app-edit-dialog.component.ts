import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AppRepository} from '../../../shared/services/app-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
  selector: 'app-app-edit-dialog',
  templateUrl: './app-edit-dialog.component.html',
  styleUrls: ['./app-edit-dialog.component.scss']
})
export class AppEditDialogComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    protected appRepository: AppRepository,
    protected nzModalRef: NzModalRef,
    protected nzMessageService: NzMessageService
  ) { }

  @Input() mode = '';
  @Input() data;

  searchForm = this.fb.group({
    id: [],
    name: ['', Validators.required],
    cnName: [''],
    programmingLanguage: [''],
    level: [''],
    repository: [''],
    comment: ['']
  });

  ngOnInit(): void {
    if (this.data) {
      this.searchForm.get('id').setValue(this.data.id);
      this.searchForm.get('name').setValue(this.data.name);
      this.searchForm.get('cnName').setValue(this.data.cnName);
      this.searchForm.get('programmingLanguage').setValue(this.data.programmingLanguage);
      this.searchForm.get('level').setValue(this.data.level);
      this.searchForm.get('repository').setValue(this.data.repository);
      this.searchForm.get('comment').setValue(this.data.comment);
    }
  }

  onSubmit(): void{
    const value = this.searchForm.value;
    (this.mode === 'edit' ? this.appRepository.update(value) :
      this.appRepository.add(value)).subscribe(result => {
      this.nzMessageService.info(this.mode ? '修改成功' : '新增成功');
      this.nzModalRef.close(result);
    });
  }
  onClose(): void{
    this.nzModalRef.close();
  }
}
