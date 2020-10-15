import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobCreateDialogComponent } from './job-create-dialog.component';

describe('JobCreateDialogComponent', () => {
  let component: JobCreateDialogComponent;
  let fixture: ComponentFixture<JobCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobCreateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
