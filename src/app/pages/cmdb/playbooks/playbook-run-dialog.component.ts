import {Component, Input, OnInit} from '@angular/core';
import {PlaybookRepository} from '../../../shared/services/playbook-repository';
import {NzModalRef} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-playbook-run-dialog',
  templateUrl: './playbook-run-dialog.component.html',
  styleUrls: ['./playbook-run-dialog.component.scss']
})
export class PlaybookRunDialogComponent implements OnInit {

  constructor(
    private playbookRepository: PlaybookRepository,
    private modal: NzModalRef,
  ) { }

  @Input() data;
  error = '';
  stdout = '';
  stderr = '';
  isLoadingResults = false;

  ngOnInit(): void {

  }

  onRun(): void {
    this.isLoadingResults = true;
    this.playbookRepository.run(this.data.id).subscribe(res => {
      console.log(res, '结果');
      this.error = res.error;
      this.stdout = res.stdout;
      this.stderr = res.stderr;
      this.isLoadingResults = false;
    }, err => {
      this.isLoadingResults = false;
      this.error = err.toString();
    });
  }
  onClose(): void {
    this.modal.close();
  }
}
