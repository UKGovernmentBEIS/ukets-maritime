import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { AccountClosureSubmittedSummaryTemplateComponent } from '@shared/components';
import { AccountClosureDto } from '@shared/types';

describe('AccountClosureSubmittedSummaryTemplateComponent', () => {
  let component: AccountClosureSubmittedSummaryTemplateComponent;
  let fixture: ComponentFixture<AccountClosureSubmittedSummaryTemplateComponent>;

  class Page extends BasePage<AccountClosureSubmittedSummaryTemplateComponent> {}
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosureSubmittedSummaryTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountClosureSubmittedSummaryTemplateComponent);
    fixture.componentRef.setInput('accountClosure', {
      reason: 'closure reason',
      submitter: 'Regulator England',
      closureDate: '2024-12-02T13:09:00.00000Z',
    } as AccountClosureDto);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Reason',
      'closure reason',
      'Closed by',
      'Regulator England',
      'Date',
      '2 Dec 2024, 1:09pm',
    ]);
  });
});
