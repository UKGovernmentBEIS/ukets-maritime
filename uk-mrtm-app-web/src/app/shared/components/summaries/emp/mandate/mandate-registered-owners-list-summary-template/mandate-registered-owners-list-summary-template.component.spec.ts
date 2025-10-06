import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { MandateRegisteredOwnersListSummaryTemplateComponent } from '@shared/components/summaries/emp/mandate/mandate-registered-owners-list-summary-template';

describe('MandateRegisteredOwnersListSummaryTemplateComponent', () => {
  let component: MandateRegisteredOwnersListSummaryTemplateComponent;
  let fixture: ComponentFixture<MandateRegisteredOwnersListSummaryTemplateComponent>;
  let page: Page;

  class Page extends BasePage<MandateRegisteredOwnersListSummaryTemplateComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MandateRegisteredOwnersListSummaryTemplateComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MandateRegisteredOwnersListSummaryTemplateComponent);
    fixture.componentRef.setInput('registeredOwnerItems', '11111111-1111-4111-a111-111111111111');
    fixture.componentRef.setInput('registeredOwnerItems', [
      {
        uniqueIdentifier: '11111111-1111-4111-a111-111111111111',
        name: 'RegisteredOwner1',
        imoNumber: '1000000',
        contactName: 'RegisteredOwner1',
        email: 'RegisteredOwner1@o.com',
        effectiveDate: '2025-03-01',
        ships: [
          {
            imoNumber: '1111111',
            name: 'EVER GREEN',
          },
        ],
      },
      {
        uniqueIdentifier: '22222222-2222-4222-a222-222222222222',
        name: 'RegisteredOwner2',
        imoNumber: '2000000',
        contactName: 'RegisteredOwner2',
        email: 'RegisteredOwner2@o.com',
        effectiveDate: '2025-03-01',
        ships: [
          {
            imoNumber: '2222222',
            name: 'Thon Green',
          },
        ],
      },
    ]);

    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.tableContents).toEqual([
      'Registered owner name and IMO number',
      'Contact details',
      'Associated ships',
      'Date of written agreement',
      'RegisteredOwner11000000',
      'RegisteredOwner1RegisteredOwner1@o.com',
      'EVER GREEN (IMO: 1111111)',
      '1 Mar 2025',
      'RegisteredOwner22000000',
      'RegisteredOwner2RegisteredOwner2@o.com',
      'Thon Green (IMO: 2222222)',
      '1 Mar 2025',
    ]);
  });
});
