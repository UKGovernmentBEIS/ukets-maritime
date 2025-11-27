import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { NonComplianceCloseFormComponent } from '@requests/common/non-compliance/non-compliance-close/components/non-compliance-close-form/non-compliance-close-form.component';
import { NonComplianceCloseService } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.service';
import { mockNonComplianceFinalDeterminationRequestTask } from '@requests/common/non-compliance/testing';
import { taskProviders } from '@requests/common/task.providers';

describe('NonComplianceCloseFormComponent', () => {
  let component: NonComplianceCloseFormComponent;
  let fixture: ComponentFixture<NonComplianceCloseFormComponent>;
  let store: RequestTaskStore;
  const activatedRouteMock = new ActivatedRouteStub();
  const closeServiceMock: MockType<NonComplianceCloseService> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonComplianceCloseFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: NonComplianceCloseService, useValue: closeServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    store = TestBed.inject(RequestTaskStore);
    store.setState(mockNonComplianceFinalDeterminationRequestTask);

    fixture = TestBed.createComponent(NonComplianceCloseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
