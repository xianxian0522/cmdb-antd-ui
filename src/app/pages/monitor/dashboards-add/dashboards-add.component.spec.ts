import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsAddComponent } from './dashboards-add.component';

describe('DashboardsAddComponent', () => {
  let component: DashboardsAddComponent;
  let fixture: ComponentFixture<DashboardsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardsAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
