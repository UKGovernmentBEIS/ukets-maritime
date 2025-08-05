import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NotificationCompletedSummaryTemplateComponent } from '@shared/components';

describe('NotificationCompletedSummaryTemplateComponent', () => {
  let component: NotificationCompletedSummaryTemplateComponent;
  let fixture: ComponentFixture<NotificationCompletedSummaryTemplateComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationCompletedSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationCompletedSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('notificationCompleted', {
      request: 'request',
      response: 'response',
      dueDate: '2027-01-01',
      submissionDate: '2024-01-01',
      decisionType: 'ACCEPTED',
      usersInfo: {
        '123': {
          name: 'Regulator',
        },
        '456': {
          name: 'Operator',
          roleCode: 'operator_admin',
          contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
        },
      },
      signatory: '123',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
