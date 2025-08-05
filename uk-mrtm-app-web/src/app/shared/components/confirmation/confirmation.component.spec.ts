import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ConfirmationSharedComponent } from '@shared/components';

describe('ConfirmationSharedComponent', () => {
  let component: ConfirmationSharedComponent;
  let fixture: ComponentFixture<ConfirmationSharedComponent>;
  let page: Page;

  class Page extends BasePage<ConfirmationSharedComponent> {
    get confirmationMessage() {
      return this.query('.govuk-panel__title').innerHTML.trim();
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationSharedComponent);
    component = fixture.componentInstance;
    component.title = 'The notification has been recalled';
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation message', () => {
    expect(page.confirmationMessage).toBe('The notification has been recalled');
  });
});
