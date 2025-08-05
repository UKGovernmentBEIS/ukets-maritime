import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RdeRegulatorDecisionSummaryTemplateComponent } from '@shared/components';
import { RdeForceDecision } from '@shared/types';

describe('RdeRegulatorDecisionSummaryTemplateComponent', () => {
  class Page extends BasePage<RdeRegulatorDecisionSummaryTemplateComponent> {}
  let component: RdeRegulatorDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<RdeRegulatorDecisionSummaryTemplateComponent>;
  let page: Page;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RdeRegulatorDecisionSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RdeRegulatorDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('data', {
      decision: 'ACCEPTED',
      evidence: 'acceptance evidence',
      files: [
        {
          downloadUrl: '',
          fileName: 'file name',
        },
      ],
    } as RdeForceDecision);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Decision',
      'Accepted',
      'Evidence of operator consent',
      'acceptance evidence',
      'Files',
      'file name',
    ]);
  });
});
