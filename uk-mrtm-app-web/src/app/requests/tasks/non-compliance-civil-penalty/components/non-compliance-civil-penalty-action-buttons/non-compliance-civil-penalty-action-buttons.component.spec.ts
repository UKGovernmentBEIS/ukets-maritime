import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonComplianceCivilPenaltyActionButtonsComponent } from '@requests/tasks/non-compliance-civil-penalty/components';

describe('NonComplianceCivilPenaltyActionButtonsComponent', () => {
  let component: NonComplianceCivilPenaltyActionButtonsComponent;
  let fixture: ComponentFixture<NonComplianceCivilPenaltyActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCivilPenaltyActionButtonsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceCivilPenaltyActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
