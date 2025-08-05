import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BasePage } from '@netz/common/testing';

import { ReturnForAmendsSuccessComponent } from '@requests/tasks/notification-follow-up-review/return-for-amends/return-for-amends-success';

describe('ReturnForAmendsSuccessComponent', () => {
  let component: ReturnForAmendsSuccessComponent;
  let fixture: ComponentFixture<ReturnForAmendsSuccessComponent>;
  let page: Page;

  class Page extends BasePage<ReturnForAmendsSuccessComponent> {
    get paragraphs(): HTMLParagraphElement[] {
      return this.queryAll<HTMLParagraphElement>('p');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnForAmendsSuccessComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ReturnForAmendsSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent.trim()).toEqual('Returned to operator for amends');
    expect(page.heading3).toBeTruthy();
    expect(page.heading3.textContent.trim()).toEqual('What happens next');
    expect(page.paragraphs).toHaveLength(1);
  });
});
