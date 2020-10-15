import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaybookEditDialogComponent } from './playbook-edit-dialog.component';

describe('PlaybookEditDialogComponent', () => {
  let component: PlaybookEditDialogComponent;
  let fixture: ComponentFixture<PlaybookEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlaybookEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaybookEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
