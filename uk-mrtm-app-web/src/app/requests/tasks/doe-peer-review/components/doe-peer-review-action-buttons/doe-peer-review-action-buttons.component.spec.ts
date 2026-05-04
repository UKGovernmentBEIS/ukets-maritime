import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { DoePeerReviewActionButtonsComponent } from '@requests/tasks/doe-peer-review/components';

describe('DoePeerReviewActionButtonsComponent', () => {
  let component: DoePeerReviewActionButtonsComponent;
  let fixture: ComponentFixture<DoePeerReviewActionButtonsComponent>;
  let page: Page;

  class Page extends BasePage<DoePeerReviewActionButtonsComponent> {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DoePeerReviewActionButtonsComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    fixture = TestBed.createComponent(DoePeerReviewActionButtonsComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button with correct label', () => {
    expect(page.query('a').textContent).toEqual('Peer review decision');
  });
});
