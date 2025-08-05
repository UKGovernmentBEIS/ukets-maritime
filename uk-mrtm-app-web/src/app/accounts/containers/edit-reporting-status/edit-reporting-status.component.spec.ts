import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

import { MaritimeAccountsService, MaritimeAccountUpdateService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingRequestService } from '@netz/common/services';
import { ActivatedRouteStub, mockClass } from '@netz/common/testing';
import { SelectComponent, TextareaComponent } from '@netz/govuk-components';

import { EditReportingStatusComponent } from '@accounts/containers/edit-reporting-status';
import { OperatorAccountsStore } from '@accounts/store';
import { WizardStepComponent } from '@shared/components';

describe('EditReportingStatusComponent', () => {
  let fixture: ComponentFixture<EditReportingStatusComponent>;
  let store: OperatorAccountsStore;
  const route = new ActivatedRouteStub();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterLinkWithHref,
        EditReportingStatusComponent,
        PageHeadingComponent,
        WizardStepComponent,
        SelectComponent,
        TextareaComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        OperatorAccountsStore,
        { provide: MaritimeAccountsService, useValue: mockClass(MaritimeAccountsService) },
        { provide: MaritimeAccountUpdateService, useValue: mockClass(MaritimeAccountUpdateService) },
        { provide: PendingRequestService, useValue: mockClass(PendingRequestService) },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();

    store = TestBed.inject(OperatorAccountsStore);
    store.setCurrentAccount({
      account: {
        id: 1,
        imoNumber: '',
        name: '',
        line1: '',
        city: '',
        country: '',
        firstMaritimeActivityDate: '',
      },
    });
    store.setCurrentStatus({
      status: 'EXEMPT',
      year: '2025',
      reason: 'Lorem ipsum',
      reported: false,
    });
    fixture = TestBed.createComponent(EditReportingStatusComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});
