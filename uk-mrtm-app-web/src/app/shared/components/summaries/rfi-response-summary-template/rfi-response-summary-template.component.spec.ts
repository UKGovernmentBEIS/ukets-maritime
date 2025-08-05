import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { RfiResponseSummaryTemplateComponent } from '@shared/components';
import { RfiResponse } from '@shared/types';

describe('RfiResponseSummaryTemplateComponent', () => {
  class Page extends BasePage<RfiResponseSummaryTemplateComponent> {}
  let component: RfiResponseSummaryTemplateComponent;
  let fixture: ComponentFixture<RfiResponseSummaryTemplateComponent>;
  let page: Page;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfiResponseSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(RfiResponseSummaryTemplateComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.componentRef.setInput('data', {
      questions: ['q1', 'q2', 'q3'],
      answers: ['a1', 'a2', 'a3'],
      operatorFiles: [
        {
          fileName: 'operator file 1',
          downloadUrl: '',
        },
      ],
      regulatorFiles: [
        {
          fileName: 'regulator file 1',
          downloadUrl: '',
        },
      ],
    } as RfiResponse);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Question 1',
      'q1',
      'Response',
      'a1',
      'Question 2',
      'q2',
      'Response',
      'a2',
      'Question 3',
      'q3',
      'Response',
      'a3',
      'Regulator files',
      'regulator file 1',
      'Operator files',
      'operator file 1',
    ]);
  });
});
