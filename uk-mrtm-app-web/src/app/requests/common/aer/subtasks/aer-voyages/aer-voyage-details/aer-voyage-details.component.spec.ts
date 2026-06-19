import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerVoyageDetailsComponent } from '@requests/common/aer/subtasks/aer-voyages';
import { AerVoyageDetailsPayloadMutator } from '@requests/common/aer/subtasks/aer-voyages/aer-voyage-details/aer-voyage-details.payload-mutator';
import { aerEmissionsMock, mockAerStateBuild } from '@requests/common/aer/testing';
import { taskProviders } from '@requests/common/task.providers';
import { TASK_FORM } from '@requests/common/task-form.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

// The voyage date-time handling must be timezone-independent. To prove it, the
// whole suite is executed under three different timezones:
//   - one behind UTC (Miami / US Eastern, UTC-5)
//   - one at UTC (London during winter / Iceland, UTC+0)
//   - one ahead of UTC (Tokyo, UTC+9)
// `process.env.TZ` is changed before each test run (and therefore before any
// `Date` is instantiated by the form provider / mutator) so that Node picks up
// the new zone for the subsequent `Date` operations.
const TIMEZONES = [
  { name: 'before UTC (America/New_York, UTC-5)', tz: 'America/New_York' },
  { name: 'at UTC (UTC)', tz: 'UTC' },
  { name: 'after UTC (Asia/Tokyo, UTC+9)', tz: 'Asia/Tokyo' },
];

describe('AerVoyageDetailsComponent', () => {
  const VOYAGE_ID = '11111111-1111-4111-a111-111111111111';
  const IMO_NUMBER = '1111111';
  // 1:00:00 on 1/1/2022, stored as a UTC instant.
  const DEPARTURE_TIME_ISO = '2022-01-01T01:00:00.000Z';
  const ARRIVAL_TIME_ISO = '2022-01-01T02:00:00.000Z';

  const route = new ActivatedRouteStub({ voyageId: VOYAGE_ID });
  const taskServiceMock: MockType<TaskService<any>> = {};

  const voyageEmissionsMock = {
    voyages: [
      {
        uniqueIdentifier: VOYAGE_ID,
        imoNumber: IMO_NUMBER,
        voyageDetails: {
          departureTime: DEPARTURE_TIME_ISO,
          arrivalTime: ARRIVAL_TIME_ISO,
          departurePort: { country: 'GB', port: 'GBABD' },
          arrivalPort: { country: 'GB', port: 'GBARD' },
        },
      },
    ],
  };

  const originalTz = process.env.TZ;

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  describe.each(TIMEZONES)('in timezone $name', ({ tz }) => {
    let component: AerVoyageDetailsComponent;
    let fixture: ComponentFixture<AerVoyageDetailsComponent>;
    let store: RequestTaskStore;

    beforeEach(async () => {
      // Switch the timezone before any `Date` is created for this test run.
      process.env.TZ = tz;

      await TestBed.configureTestingModule({
        imports: [AerVoyageDetailsComponent],
        providers: [
          RequestTaskStore,
          { provide: ActivatedRoute, useValue: route },
          { provide: TaskService, useValue: taskServiceMock },
          ...taskProviders,
        ],
      }).compileComponents();

      store = TestBed.inject(RequestTaskStore);
      store.setState(
        mockAerStateBuild(
          { emissions: aerEmissionsMock, voyageEmissions: voyageEmissionsMock },
          { emissions: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(AerVoyageDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should parse the stored voyage date-times into the form independently of the timezone', () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      const departureDate = form.get('departureDate').value as Date;
      const departureTime = form.get('departureTime').value as Date;
      const arrivalDate = form.get('arrivalDate').value as Date;
      const arrivalTime = form.get('arrivalTime').value as Date;

      // Regardless of the local offset, the date/time read by the
      // DatePicker/TimeInput (via UTC getters) must match the stored value exactly.
      expect(departureDate.getUTCFullYear()).toBe(2022);
      expect(departureDate.getUTCMonth()).toBe(0);
      expect(departureDate.getUTCDate()).toBe(1);
      expect(departureTime.getUTCHours()).toBe(1);
      expect(departureTime.getUTCMinutes()).toBe(0);
      expect(departureTime.getUTCSeconds()).toBe(0);

      expect(arrivalDate.getUTCDate()).toBe(1);
      expect(arrivalTime.getUTCHours()).toBe(2);
    });

    it('should serialise the form value back into the same timezone-independent ISO strings', async () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      const currentPayload = {
        aer: {
          voyageEmissions: {
            voyages: [{ uniqueIdentifier: VOYAGE_ID, imoNumber: IMO_NUMBER }],
          },
        },
        aerSectionsCompleted: {},
      } as unknown as AerSubmitTaskPayload;

      const mutator = TestBed.runInInjectionContext(() => new AerVoyageDetailsPayloadMutator());
      const result = await firstValueFrom(mutator.apply(currentPayload, form.value));

      const { voyageDetails } = result.aer.voyageEmissions.voyages[0];

      // 1:00:00 on 1/1/2022 must be serialised as 2022-01-01T01:00:00.000Z,
      // NOT shifted by the local offset (previously 2022-01-01T06:00:00.000Z).
      expect(voyageDetails.departureTime).toBe(DEPARTURE_TIME_ISO);
      expect(voyageDetails.arrivalTime).toBe(ARRIVAL_TIME_ISO);
    });

    it('should keep a freshly entered time of 1:00:00 on 1/1/2022 as 01:00:00Z in the payload', async () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      // Mimic what the DatePicker/TimeInput emit for a user entering
      // date 1/1/2022 and time 1:00:00 (UTC based controls).
      form.get('departureDate').setValue(new Date(Date.UTC(2022, 0, 1, 0, 0, 0)));
      form.get('departureTime').setValue(new Date(Date.UTC(2022, 0, 1, 1, 0, 0)));
      form.get('arrivalDate').setValue(new Date(Date.UTC(2022, 0, 1, 0, 0, 0)));
      form.get('arrivalTime').setValue(new Date(Date.UTC(2022, 0, 1, 1, 0, 0)));

      const currentPayload = {
        aer: {
          voyageEmissions: {
            voyages: [{ uniqueIdentifier: VOYAGE_ID, imoNumber: IMO_NUMBER }],
          },
        },
        aerSectionsCompleted: {},
      } as unknown as AerSubmitTaskPayload;

      const mutator = TestBed.runInInjectionContext(() => new AerVoyageDetailsPayloadMutator());
      const result = await firstValueFrom(mutator.apply(currentPayload, form.value));

      const { voyageDetails } = result.aer.voyageEmissions.voyages[0];

      expect(voyageDetails.departureTime).toBe('2022-01-01T01:00:00.000Z');
      expect(voyageDetails.arrivalTime).toBe('2022-01-01T01:00:00.000Z');
    });
  });
});
