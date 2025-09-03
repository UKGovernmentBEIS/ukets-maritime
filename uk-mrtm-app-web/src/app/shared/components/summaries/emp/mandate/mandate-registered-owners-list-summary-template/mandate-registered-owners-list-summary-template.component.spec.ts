import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MandateRegisteredOwnersListSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template';

describe('MandateRegisteredOwnersListSummaryTemplateComponent', () => {
  let component: MandateRegisteredOwnersListSummaryTemplateComponent;
  let fixture: ComponentFixture<MandateRegisteredOwnersListSummaryTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateRegisteredOwnersListSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateRegisteredOwnersListSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
