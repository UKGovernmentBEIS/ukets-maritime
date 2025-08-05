import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { VirReviewNotifyOperatorSuccessComponent } from '@requests/tasks/vir-review/components/vir-review-notify-operator-success';

describe('VirReviewNotifyOperatorSuccessComponent', () => {
  class Page extends BasePage<VirReviewNotifyOperatorSuccessComponent> {}
  let component: VirReviewNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<VirReviewNotifyOperatorSuccessComponent>;
  let page: Page;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirReviewNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(VirReviewNotifyOperatorSuccessComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements', () => {
    expect(page.heading1.textContent).toEqual('Verifier improvement report sent to operator');
    expect(page.heading3.textContent).toEqual('What happens next');
    expect(page.query('p.govuk-body').textContent.trim()).toEqual(
      'The operator will be notified of any improvement actions and will have a task to respond to the actions, if applicable.',
    );
    expect(page.query('a').textContent).toEqual('Return to: Dashboard');
  });
});
