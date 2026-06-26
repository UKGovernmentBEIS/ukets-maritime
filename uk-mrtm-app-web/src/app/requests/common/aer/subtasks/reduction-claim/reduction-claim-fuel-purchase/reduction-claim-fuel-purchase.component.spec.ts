import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { RequestTaskAttachmentsHandlingService } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';
import { mockRequestTask } from '@netz/common/request-task';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, asyncData, BasePage, MockType } from '@netz/common/testing';

import { reductionClaimMap } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim.map';
import { ReductionClaimFuelPurchaseComponent } from '@requests/common/aer/subtasks/reduction-claim/reduction-claim-fuel-purchase';
import { taskProviders } from '@requests/common/task.providers';

const uuid4 = '44444444-4444-4444-a444-444444444444';

Object.defineProperty(window, 'crypto', {
  value: { getRandomValues: jest.fn().mockReturnValue(uuid4), randomUUID: jest.fn().mockReturnValue(uuid4) },
});

const mockState = {
  ...mockRequestTask,
  isEditable: true,
  requestTaskItem: {
    ...mockRequestTask.requestTaskItem,
    requestTask: {
      ...mockRequestTask.requestTaskItem.requestTask,
      type: 'AER_APPLICATION_SUBMIT',
      payload: {
        payloadType: 'AER_APPLICATION_SUBMIT_PAYLOAD',
        aer: {
          emissions: {
            ships: [
              {
                uniqueIdentifier: 'ship-1',
                details: { name: 'Test Ship', imoNumber: '1234567' },
                fuelsAndEmissionsFactors: [
                  {
                    uniqueIdentifier: 'fuel-1',
                    fuelOrigin: 'FOSSIL_FUEL',
                    fuelType: 'DIESEL_OR_GASOIL',
                  },
                ],
              },
            ],
          },
          smf: {
            smfDetails: {
              exist: true,
              purchases: [],
            },
          },
        },
        aerAttachments: {},
        aerSectionsCompleted: {},
      },
    },
  },
};

describe('ReductionClaimFuelPurchaseComponent', () => {
  let component: ReductionClaimFuelPurchaseComponent;
  let fixture: ComponentFixture<ReductionClaimFuelPurchaseComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const taskServiceMock: MockType<TaskService<any>> = {
    saveSubtask: jest.fn().mockReturnValue(of({})),
  };
  const attachmentService: MockType<RequestTaskAttachmentsHandlingService> = {
    uploadRequestTaskAttachment: jest.fn().mockReturnValue(asyncData<any>(new HttpResponse({ body: { uuid: uuid4 } }))),
  };

  class Page extends BasePage<ReductionClaimFuelPurchaseComponent> {
    get co2EmissionsText(): string {
      const paragraphs = this.queryAll<HTMLParagraphElement>('p.govuk-body');
      return paragraphs.find((p) => p.textContent?.trim() !== '')?.textContent?.trim() ?? '';
    }

    get co2EmissionsValue(): string {
      const paragraphs = this.queryAll<HTMLParagraphElement>('p.govuk-body');
      const idx = paragraphs.findIndex(
        (p) => p.textContent?.includes('Not calculated yet') || p.textContent?.match(/^\d/),
      );
      return paragraphs[idx]?.textContent?.trim() ?? '';
    }

    set smfMass(value: string) {
      this.setInputValue('input[id*="smfMass"]', value);
    }

    set co2EmissionFactor(value: string) {
      this.setInputValue('input[id*="co2EmissionFactor"]', value);
    }

    get insetText(): HTMLElement | null {
      return this.query('.govuk-inset-text');
    }
  }

  const createComponent = () => {
    fixture = TestBed.createComponent(ReductionClaimFuelPurchaseComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
    jest.clearAllMocks();
  };

  describe('Add mode (no fuelPurchaseId)', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReductionClaimFuelPurchaseComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: TaskService, useValue: taskServiceMock },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub() },
          { provide: RequestTaskAttachmentsHandlingService, useValue: attachmentService },
          ...taskProviders,
        ],
      }).compileComponents();

      store = TestBed.inject(RequestTaskStore);
      store.setState(mockState);
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display "Add" heading in add mode', () => {
      expect(page.heading1.textContent.trim()).toBe(reductionClaimMap.purchaseAdd.title);
    });

    it('should show validation errors when submitted with empty form', () => {
      page.submitButton.click();
      fixture.detectChanges();

      expect(page.errorSummary).toBeTruthy();
      expect(page.errorSummaryListContents).toContain('Select a fuel type');
      expect(page.errorSummaryListContents).toContain('Enter a batch number');
      expect(page.errorSummaryListContents).toContain('Enter a total mass of eligible fuel claimed from the batch');
      expect(page.errorSummaryListContents).toContain('Enter emission factor for carbon dioxide');
    });

    it('should show "Not calculated yet" for CO2 emissions when fields are empty', () => {
      const allParagraphs = fixture.nativeElement.querySelectorAll('p.govuk-body');
      const co2Para = Array.from(allParagraphs).find((p: HTMLElement) =>
        p.textContent?.includes('Not calculated yet'),
      ) as HTMLElement;
      expect(co2Para).toBeTruthy();
    });

    it('should auto-calculate CO2 emissions when smfMass and co2EmissionFactor are filled', async () => {
      component.form.get('smfMass').setValue('100');
      component.form.get('co2EmissionFactor').setValue('3.2');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.get('co2Emissions').value).toBe('320');
    });

    it('should clear CO2 emissions when smfMass is removed', async () => {
      component.form.get('smfMass').setValue('100');
      component.form.get('co2EmissionFactor').setValue('3.2');
      fixture.detectChanges();
      await fixture.whenStable();

      component.form.get('smfMass').setValue(null);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.form.get('co2Emissions').value).toBeNull();
    });
  });

  describe('Edit mode (with fuelPurchaseId)', () => {
    const existingPurchase = {
      uniqueIdentifier: uuid4,
      dataInputType: 'MANUAL',
      batchNumber: 'BATCH-001',
      smfMass: '50',
      co2EmissionFactor: '2.5',
      co2Emissions: '125.0000000',
      fuelOriginTypeName: { uniqueIdentifier: 'fuel-1', fuelOrigin: 'FOSSIL_FUEL', fuelType: 'DIESEL_OR_GASOIL' },
      evidenceFiles: [],
    };

    const stateWithPurchase = {
      ...mockState,
      requestTaskItem: {
        ...mockState.requestTaskItem,
        requestTask: {
          ...mockState.requestTaskItem.requestTask,
          payload: {
            ...mockState.requestTaskItem.requestTask.payload,
            aer: {
              ...mockState.requestTaskItem.requestTask.payload.aer,
              smf: {
                smfDetails: {
                  exist: true,
                  purchases: [existingPurchase],
                },
              },
            },
          },
        },
      },
    };

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ReductionClaimFuelPurchaseComponent],
        providers: [
          provideRouter([]),
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: TaskService, useValue: taskServiceMock },
          { provide: ActivatedRoute, useValue: new ActivatedRouteStub({ fuelPurchaseId: uuid4 }) },
          { provide: RequestTaskAttachmentsHandlingService, useValue: attachmentService },
          ...taskProviders,
        ],
      }).compileComponents();

      store = TestBed.inject(RequestTaskStore);
      store.setState(stateWithPurchase);
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display "Edit" heading in edit mode', () => {
      expect(page.heading1.textContent.trim()).toBe(reductionClaimMap.purchaseEdit.title);
    });

    it('should pre-populate the form with existing purchase data', () => {
      expect(component.form.get('batchNumber').value).toBe('BATCH-001');
      expect(component.form.get('smfMass').value).toBe('50');
      expect(component.form.get('co2EmissionFactor').value).toBe('2.5');
    });
  });
});
