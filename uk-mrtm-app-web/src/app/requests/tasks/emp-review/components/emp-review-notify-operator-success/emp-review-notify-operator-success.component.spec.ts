import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EmpReviewTaskPayload } from '@requests/common';
import { EmpReviewNotifyOperatorSuccessComponent } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success/emp-review-notify-operator-success.component';
import { empReviewNotifyOperatorStatusMap } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success/emp-review-notify-operator-success.consts';

describe('EmpReviewNotifyOperatorSuccessComponent', () => {
  let component: EmpReviewNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<EmpReviewNotifyOperatorSuccessComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const setState = (status: EmpIssuanceDetermination['type'] = 'APPROVED'): void => {
    store.setState({
      ...mockRequestTask,
      requestTaskItem: {
        ...mockRequestTask?.requestTaskItem,
        requestTask: {
          ...mockRequestTask?.requestTaskItem?.requestTask,
          payload: {
            ...mockRequestTask?.requestTaskItem?.requestTask?.payload,
            determination: {
              type: status,
            },
          } as EmpReviewTaskPayload,
        },
      },
    });
  };

  class Page extends BasePage<EmpReviewNotifyOperatorSuccessComponent> {}

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmpReviewNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    });

    fixture = TestBed.createComponent(EmpReviewNotifyOperatorSuccessComponent);
    store = TestBed.inject(RequestTaskStore);
    setState();
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each<EmpIssuanceDetermination['type']>(['APPROVED', 'DEEMED_WITHDRAWN'])(
    'should display correct texts for status %s',
    (status) => {
      setState(status);
      fixture.detectChanges();

      expect(page.heading1.textContent).toEqual(`Application ${empReviewNotifyOperatorStatusMap[status]}`);
      expect(page.paragraphs.map((item) => item.textContent.trim())).toEqual([
        `You have ${empReviewNotifyOperatorStatusMap[status]} the operator’s emissions monitoring plan application.`,
        'The selected users will receive an email notification of your decision.',
      ]);

      expect(page.link.textContent).toEqual('Return to: Dashboard');
    },
  );
});
