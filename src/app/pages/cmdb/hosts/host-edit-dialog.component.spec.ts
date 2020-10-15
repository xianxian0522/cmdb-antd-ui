import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostEditDialogComponent } from './host-edit-dialog.component';

describe('HostEditDialogComponent', () => {
  let component: HostEditDialogComponent;
  let fixture: ComponentFixture<HostEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
