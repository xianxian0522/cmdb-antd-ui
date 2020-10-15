import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsEditorComponent } from './dashboards-editor.component';

describe('DashboardsEditorComponent', () => {
  let component: DashboardsEditorComponent;
  let fixture: ComponentFixture<DashboardsEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardsEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
