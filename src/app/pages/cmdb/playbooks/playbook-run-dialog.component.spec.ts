import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybookRunDialogComponent } from './playbook-run-dialog.component';

describe('PlaybookRunDialogComponent', () => {
  let component: PlaybookRunDialogComponent;
  let fixture: ComponentFixture<PlaybookRunDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaybookRunDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybookRunDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
