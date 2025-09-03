import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { NonComplianceNotifiedUsersSummaryTemplateComponent } from '@shared/components/summaries';

describe('NonComplianceNotifiedUsersSummaryTemplateComponent', () => {
  let component: NonComplianceNotifiedUsersSummaryTemplateComponent;
  let fixture: ComponentFixture<NonComplianceNotifiedUsersSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<NonComplianceNotifiedUsersSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceNotifiedUsersSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NonComplianceNotifiedUsersSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('notifiedUsersInfo', {
      op1UserId: {
        name: 'Operator1 User',
        roleCode: 'operator_admin',
        contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
      },
      op2UserId: {
        name: 'Operator2 User',
        roleCode: 'operator_admin',
        contactTypes: ['SECONDARY'],
      },
    });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.summariesContents).toEqual([
      'Users',
      'Operator1 User, Operator admin - Primary contact, Service contact, Financial contact' +
        'Operator2 User, Operator admin - Secondary contact',
    ]);
  });
});
