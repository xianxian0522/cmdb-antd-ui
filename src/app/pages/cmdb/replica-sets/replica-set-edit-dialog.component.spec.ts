import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplicaSetEditDialogComponent } from './replica-set-edit-dialog.component';

describe('ReplicaSetEditDialogComponent', () => {
  let component: ReplicaSetEditDialogComponent;
  let fixture: ComponentFixture<ReplicaSetEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplicaSetEditDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplicaSetEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
