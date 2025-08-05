import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { AccountClosureSuccessComponent } from '@requests/tasks/account-closure/components';

describe('AccountClosureSuccessComponent', () => {
  let component: AccountClosureSuccessComponent;
  let fixture: ComponentFixture<AccountClosureSuccessComponent>;
  let page: Page;

  class Page extends BasePage<AccountClosureSuccessComponent> {
    get panel(): HTMLElement {
      return this.query<HTMLElement>('govuk-panel');
    }

    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(AccountClosureSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountClosureSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();
    createComponent();
  });

  it('should display all HTMLElements', () => {
    expect(component).toBeTruthy();
    expect(page.panel).toBeTruthy();
    expect(page.paragraphs).toHaveLength(1);
  });
});
