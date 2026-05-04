import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub } from '@netz/common/testing';

import { NotificationDecisionSummaryTemplateComponent } from '@shared/components';

describe('NotificationDecisionSummaryTemplateComponent', () => {
  let component: NotificationDecisionSummaryTemplateComponent;
  let fixture: ComponentFixture<NotificationDecisionSummaryTemplateComponent>;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationDecisionSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationDecisionSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('usersInfo', {
      '123': {
        name: 'Regulator',
      },
      '456': {
        name: 'Operator',
        roleCode: 'operator_admin',
        contactTypes: ['PRIMARY', 'SERVICE', 'FINANCIAL'],
      },
    });
    fixture.componentRef.setInput('reviewDecision', {
      details: {
        officialNotice: 'notice text',
        notes: 'notes',
        followUp: {
          followUpResponseRequired: false,
          followUpRequest: null,
          followUpResponseExpirationDate: null,
        },
      },
      type: 'ACCEPTED',
    });
    fixture.componentRef.setInput('officialNotice', {
      fileName: 'file name',
      downloadUrl: '',
    });
    fixture.componentRef.setInput('reviewDecisionNotification', {
      signatory: '123',
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
