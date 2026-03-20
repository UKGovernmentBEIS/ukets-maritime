import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { EmpVariationDetermination } from '@mrtm/api';

import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { EmpVariationReviewTaskPayload } from '@requests/common/emp/emp.types';
import { EmpVariationNotifyOperatorSuccessComponent } from '@requests/tasks/emp-variation-review/components';
import { empVariationNotifyOperatorStatusMap } from '@requests/tasks/emp-variation-review/components/emp-variation-notify-operator-success/emp-variation-notify-operator-success.consts';

describe('EmpVariationNotifyOperatorSuccessComponent', () => {
  let component: EmpVariationNotifyOperatorSuccessComponent;
  let fixture: ComponentFixture<EmpVariationNotifyOperatorSuccessComponent>;
  let store: RequestTaskStore;
  let page: Page;

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

  class Page extends BasePage<EmpVariationNotifyOperatorSuccessComponent> {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpVariationNotifyOperatorSuccessComponent],
      providers: [{ provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpVariationNotifyOperatorSuccessComponent);
    store = TestBed.inject(RequestTaskStore);
    setState();
    component = fixture.componentInstance;
    page = new Page(fixture);
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

      expect(page.heading1.textContent).toEqual(`Variation ${empVariationNotifyOperatorStatusMap[status]}`);
      expect(page.paragraphs.map((item) => item.textContent.trim())).toEqual([
        `You have ${empVariationNotifyOperatorStatusMap[status]} the operator’s emissions monitoring plan variation.`,
        'The selected users will receive an email notification of your decision.',
      ]);
      expect(page.link.textContent).toEqual('Return to: Dashboard');
    },
  );
});
