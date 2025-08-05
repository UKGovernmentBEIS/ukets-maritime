import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceNoticeOfIntentActionButtonsComponent } from '@requests/tasks/non-compliance-notice-of-intent/components';

describe('NonComplianceNoticeOfIntentActionButtonsComponent', () => {
  let component: NonComplianceNoticeOfIntentActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceNoticeOfIntentActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNoticeOfIntentActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNoticeOfIntentActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
