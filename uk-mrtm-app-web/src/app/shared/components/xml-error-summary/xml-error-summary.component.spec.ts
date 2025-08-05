import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { XmlErrorSummaryComponent } from '@shared/components';

describe('XmlErrorSummaryComponent', () => {
  let component: XmlErrorSummaryComponent;
  let fixture: ComponentFixture<XmlErrorSummaryComponent>;
  let page: Page;

  class Page extends BasePage<XmlErrorSummaryComponent> {
    get summaries() {
      return this.queryAll<HTMLParagraphElement>('li p').map((el) => el.textContent.trim());
    }
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(XmlErrorSummaryComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('xmlErrors', [
      {
        row: 2,
        column: 'shipImoNumber',
        message: 'The IMO Number must be 7 digits',
      },
      {
        row: 3,
        column: 'shipImoNumber',
        message: 'The IMO Number must be 7 digits',
      },
    ]);
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.summaries).toEqual([
      'The IMO Number must be 7 digits',
      "Check the data  in field 'shipImoNumber'  on ship 2, 3",
    ]);
  });
});
