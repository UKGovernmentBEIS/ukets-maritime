import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpIssuanceDetermination } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpReviewTaskPayload } from '@requests/common';
import { EmpReviewNotifyOperatorSuccessComponent } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success/emp-review-notify-operator-success.component';
import { empReviewNotifyOperatorStatusMap } from '@requests/tasks/emp-review/components/emp-review-notify-operator-success/emp-review-notify-operator-success.consts';
import { screen } from '@testing-library/dom';

describe('EmpReviewNotifyOperatorSuccessComponent', () => {
  let component: EmpReviewNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<EmpReviewNotifyOperatorSuccessComponent>;
  let store: RequestTaskStore;

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpReviewNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpReviewNotifyOperatorSuccessComponent);
    store = TestBed.inject(RequestTaskStore);
    setState();
    component = fixture.componentInstance;
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

      expect(screen.getByRole('heading').textContent).toEqual(
        `Application ${empReviewNotifyOperatorStatusMap[status]}`,
      );
      expect(
        screen.getByText(
          `You have ${empReviewNotifyOperatorStatusMap[status]} the operator’s emissions monitoring plan application.`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('The selected users will receive an email notification of your decision.'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
    },
  );
});
