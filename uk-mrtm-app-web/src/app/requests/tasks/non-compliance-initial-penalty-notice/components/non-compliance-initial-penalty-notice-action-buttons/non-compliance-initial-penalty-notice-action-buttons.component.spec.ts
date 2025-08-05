import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceInitialPenaltyNoticeActionButtonsComponent } from '@requests/tasks/non-compliance-initial-penalty-notice/components';

describe('NonComplianceInitialPenaltyNoticeActionButtonsComponent', () => {
  let component: NonComplianceInitialPenaltyNoticeActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceInitialPenaltyNoticeActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceInitialPenaltyNoticeActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceInitialPenaltyNoticeActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
