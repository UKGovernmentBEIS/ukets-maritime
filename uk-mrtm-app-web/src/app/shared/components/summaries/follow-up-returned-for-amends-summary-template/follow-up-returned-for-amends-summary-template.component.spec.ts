import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpReturnedForAmendsSummaryTemplateComponent } from '@shared/components';

describe('FollowUpReturnedForAmendsSummaryTemplateComponent', () => {
  let component: FollowUpReturnedForAmendsSummaryTemplateComponent;
  let fixture: ComponentFixture<FollowUpReturnedForAmendsSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpReturnedForAmendsSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowUpReturnedForAmendsSummaryTemplateComponent);
    fixture.componentRef.setInput('followUpReturnedAmends', {
      requiredChanges: [],
      notes: '',
      dueDate: '',
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
