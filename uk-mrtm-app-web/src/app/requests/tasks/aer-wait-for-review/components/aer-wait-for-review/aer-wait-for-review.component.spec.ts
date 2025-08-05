import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { AerWaitForReviewComponent } from '@requests/tasks/aer-wait-for-review/components/aer-wait-for-review/aer-wait-for-review.component';

describe('AerWaitForReviewComponent', () => {
  class Page extends BasePage<AerWaitForReviewComponent> {}

  let component: AerWaitForReviewComponent;
  let fixture: ComponentFixture<AerWaitForReviewComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerWaitForReviewComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(AerWaitForReviewComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.query('govuk-warning-text').textContent).toEqual('!Waiting for the regulator to complete the review.');
  });
});
