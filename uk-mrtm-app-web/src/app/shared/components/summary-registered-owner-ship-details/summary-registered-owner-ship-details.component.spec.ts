import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { SummaryRegisteredOwnerShipDetailsComponent } from '@shared/components';

describe('SummaryRegisteredOwnerShipDetailsComponent', () => {
  let component: SummaryRegisteredOwnerShipDetailsComponent;
  let fixture: ComponentFixture<SummaryRegisteredOwnerShipDetailsComponent>;
  let page: Page;

  class Page extends BasePage<SummaryRegisteredOwnerShipDetailsComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryRegisteredOwnerShipDetailsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryRegisteredOwnerShipDetailsComponent);
    fixture.componentRef.setInput('registeredOwnerUniqueIdentifier', '11111111-1111-4111-a111-111111111111');
    fixture.componentRef.setInput('shipDetails', [
      {
        imoNumber: '1111111',
        name: 'EVER GREEN',
      },
      {
        imoNumber: '2222222',
        name: 'Thon Green',
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
    expect(page.listContents).toEqual(['EVER GREEN (IMO: 1111111)', 'Thon Green (IMO: 2222222)']);
  });
});
