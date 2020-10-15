import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartEditComponent } from './chart-edit.component';

describe('ChartEditComponent', () => {
  let component: ChartEditComponent;
  let fixture: ComponentFixture<ChartEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
