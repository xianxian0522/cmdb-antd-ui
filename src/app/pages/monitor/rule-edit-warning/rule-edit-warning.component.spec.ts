import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleEditWarningComponent } from './rule-edit-warning.component';

describe('RuleEditWarningComponent', () => {
  let component: RuleEditWarningComponent;
  let fixture: ComponentFixture<RuleEditWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RuleEditWarningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RuleEditWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
