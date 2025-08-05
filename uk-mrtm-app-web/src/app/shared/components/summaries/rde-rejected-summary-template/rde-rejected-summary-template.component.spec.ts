import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RdeRejectedRequestActionPayload } from '@mrtm/api';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RdeRejectedSummaryTemplateComponent } from '@shared/components';

describe('RdeRejectedSummaryTemplateComponent', () => {
  class Page extends BasePage<RdeRejectedSummaryTemplateComponent> {}
  let component: RdeRejectedSummaryTemplateComponent;
  let fixture: ComponentFixture<RdeRejectedSummaryTemplateComponent>;
  let page: Page;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeRejectedSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RdeRejectedSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('data', {
      reason: 'rejection reason',
      decision: 'REJECTED',
      payloadType: 'RDE_REJECTED_PAYLOAD',
    } as RdeRejectedRequestActionPayload);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual(['Response', 'Rejected', 'Reason', 'rejection reason']);
  });
});
