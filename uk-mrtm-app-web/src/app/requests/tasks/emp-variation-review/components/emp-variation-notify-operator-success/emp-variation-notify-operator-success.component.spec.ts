import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpVariationDetermination } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub } from '@netz/common/testing';

import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EmpVariationNotifyOperatorSuccessComponent } from '@requests/tasks/emp-variation-review/components';
import { empVariationNotifyOperatorStatusMap } from '@requests/tasks/emp-variation-review/components/emp-variation-notify-operator-success/emp-variation-notify-operator-success.consts';
import { screen } from '@testing-library/dom';

describe('EmpVariationNotifyOperatorSuccessComponent', () => {
  let component: EmpVariationNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<EmpVariationNotifyOperatorSuccessComponent>;
  let store: RequestTaskStore;

  const setState = (status: EmpVariationDetermination['type'] = 'APPROVED'): void => {
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
          } as EmpVariationReviewTaskPayload,
        },
      },
    });
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationNotifyOperatorSuccessComponent);
    store = TestBed.inject(RequestTaskStore);
    setState();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it.each<EmpVariationDetermination['type']>(['APPROVED', 'REJECTED', 'DEEMED_WITHDRAWN'])(
    'should display correct texts for status %s',
    (status) => {
      setState(status);
      fixture.detectChanges();

      expect(screen.getByRole('heading').textContent).toEqual(
        `Variation ${empVariationNotifyOperatorStatusMap[status]}`,
      );
      expect(
        screen.getByText(
          `You have ${empVariationNotifyOperatorStatusMap[status]} the operator’s emissions monitoring plan variation.`,
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText('The selected users will receive an email notification of your decision.'),
      ).toBeInTheDocument();
      expect(screen.getByRole('link').textContent).toEqual('Return to: Dashboard');
    },
  );
});
