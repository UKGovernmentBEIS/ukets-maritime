import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { CompleteReviewSuccessComponent } from '@requests/tasks/aer-review/components/complete-review-success';

describe('CompleteReviewSuccessComponent', () => {
  class Page extends BasePage<CompleteReviewSuccessComponent> {}
  let component: CompleteReviewSuccessComponent;
  let fixture: ComponentFixture<CompleteReviewSuccessComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteReviewSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteReviewSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toEqual('Emissions report completed');
    expect(page.query('a').textContent).toEqual('Return to: Dashboard');
  });
});
