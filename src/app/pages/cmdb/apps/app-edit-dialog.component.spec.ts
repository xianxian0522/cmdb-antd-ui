import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppEditDialogComponent } from './app-edit-dialog.component';

describe('AppEditDialogComponent', () => {
  let component: AppEditDialogComponent;
  let fixture: ComponentFixture<AppEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
