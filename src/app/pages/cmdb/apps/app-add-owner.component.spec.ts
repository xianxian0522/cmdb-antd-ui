import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAddOwnerComponent } from './app-add-owner.component';

describe('AppAddOwnerComponent', () => {
  let component: AppAddOwnerComponent;
  let fixture: ComponentFixture<AppAddOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppAddOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppAddOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
