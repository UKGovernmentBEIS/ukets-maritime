import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasePage } from '@netz/common/testing';

import { PaymentNotCompletedComponent } from '@shared/components';

describe('PaymentNotCompletedComponent', () => {
  let page: Page;
  let component: PaymentNotCompletedComponent;
  let fixture: ComponentFixture<PaymentNotCompletedComponent>;

  class Page extends BasePage<PaymentNotCompletedComponent> {
    get content(): HTMLHeadElement {
      return this.query('h1');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentNotCompletedComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentNotCompletedComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show content', () => {
    expect(page.content.textContent.trim()).toEqual('The payment task must be closed before you can proceed');
  });
});
