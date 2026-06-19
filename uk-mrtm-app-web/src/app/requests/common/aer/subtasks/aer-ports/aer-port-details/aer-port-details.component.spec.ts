import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { RequestTaskStore } from '@netz/common/store';
import { ActivatedRouteStub, MockType } from '@netz/common/testing';

import { AerSubmitTaskPayload } from '@requests/common/aer/aer.types';
import { AerPortDetailsComponent } from '@requests/common/aer/subtasks/aer-ports/aer-port-details';
import { AerPortDetailsPayloadMutator } from '@requests/common/aer/subtasks/aer-ports/aer-port-details/aer-port-details.payload-mutator';
import { aerEmissionsMock, mockAerStateBuild } from '@requests/common/aer/testing';
import { taskProviders } from '@requests/common/task.providers';
import { TASK_FORM } from '@requests/common/task-form.token';
import { TaskItemStatus } from '@requests/common/task-item-status';

// The port date-time handling must be timezone-independent. To prove it, the
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

describe('AerPortDetailsComponent', () => {
  const PORT_ID = '11111111-1111-4111-a111-111111111111';
  const IMO_NUMBER = '1111111';
  // 1:00:00 on 1/1/2022, stored as a UTC instant.
  const ARRIVAL_TIME_ISO = '2022-01-01T01:00:00.000Z';
  const DEPARTURE_TIME_ISO = '2022-01-01T02:00:00.000Z';

  const route = new ActivatedRouteStub({ portId: PORT_ID });
  const taskServiceMock: MockType<TaskService<any>> = {};

  const portEmissionsMock = {
    ports: [
      {
        uniqueIdentifier: PORT_ID,
        imoNumber: IMO_NUMBER,
        portDetails: {
          arrivalTime: ARRIVAL_TIME_ISO,
          departureTime: DEPARTURE_TIME_ISO,
          visit: { country: 'GB', port: 'GBABD' },
        },
      },
    ],
  };

  const originalTz = process.env.TZ;

  afterAll(() => {
    process.env.TZ = originalTz;
  });

  describe.each(TIMEZONES)('in timezone $name', ({ tz }) => {
    let component: AerPortDetailsComponent;
    let fixture: ComponentFixture<AerPortDetailsComponent>;
    let store: RequestTaskStore;

    beforeEach(async () => {
      // Switch the timezone before any `Date` is created for this test run.
      process.env.TZ = tz;

      await TestBed.configureTestingModule({
        imports: [AerPortDetailsComponent],
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
          { emissions: aerEmissionsMock, portEmissions: portEmissionsMock },
          { emissions: TaskItemStatus.IN_PROGRESS },
        ),
      );

      fixture = TestBed.createComponent(AerPortDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should parse the stored port date-times into the form independently of the timezone', () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      const arrivalDate = form.get('arrivalDate').value as Date;
      const arrivalTime = form.get('arrivalTime').value as Date;
      const departureDate = form.get('departureDate').value as Date;
      const departureTime = form.get('departureTime').value as Date;

      // Regardless of the local offset, the date/time read by the
      // DatePicker/TimeInput (via UTC getters) must match the stored value exactly.
      expect(arrivalDate.getUTCFullYear()).toBe(2022);
      expect(arrivalDate.getUTCMonth()).toBe(0);
      expect(arrivalDate.getUTCDate()).toBe(1);
      expect(arrivalTime.getUTCHours()).toBe(1);
      expect(arrivalTime.getUTCMinutes()).toBe(0);
      expect(arrivalTime.getUTCSeconds()).toBe(0);

      expect(departureDate.getUTCDate()).toBe(1);
      expect(departureTime.getUTCHours()).toBe(2);
    });

    it('should serialise the form value back into the same timezone-independent ISO strings', async () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      const currentPayload = {
        aer: {
          portEmissions: {
            ports: [{ uniqueIdentifier: PORT_ID, imoNumber: IMO_NUMBER }],
          },
        },
        aerSectionsCompleted: {},
      } as unknown as AerSubmitTaskPayload;

      const mutator = TestBed.runInInjectionContext(() => new AerPortDetailsPayloadMutator());
      const result = await firstValueFrom(mutator.apply(currentPayload, form.value));

      const { portDetails } = result.aer.portEmissions.ports[0];

      // 1:00:00 on 1/1/2022 must be serialised as 2022-01-01T01:00:00.000Z,
      // NOT shifted by the local offset (previously 2022-01-01T06:00:00.000Z).
      expect(portDetails.arrivalTime).toBe(ARRIVAL_TIME_ISO);
      expect(portDetails.departureTime).toBe(DEPARTURE_TIME_ISO);
    });

    it('should keep a freshly entered time of 1:00:00 on 1/1/2022 as 01:00:00Z in the payload', async () => {
      const form = fixture.debugElement.injector.get(TASK_FORM);

      // Mimic what the DatePicker/TimeInput emit for a user entering
      // date 1/1/2022 and time 1:00:00 (UTC based controls).
      form.get('arrivalDate').setValue(new Date(Date.UTC(2022, 0, 1, 0, 0, 0)));
      form.get('arrivalTime').setValue(new Date(Date.UTC(2022, 0, 1, 1, 0, 0)));
      form.get('departureDate').setValue(new Date(Date.UTC(2022, 0, 1, 0, 0, 0)));
      form.get('departureTime').setValue(new Date(Date.UTC(2022, 0, 1, 1, 0, 0)));

      const currentPayload = {
        aer: {
          portEmissions: {
            ports: [{ uniqueIdentifier: PORT_ID, imoNumber: IMO_NUMBER }],
          },
        },
        aerSectionsCompleted: {},
      } as unknown as AerSubmitTaskPayload;

      const mutator = TestBed.runInInjectionContext(() => new AerPortDetailsPayloadMutator());
      const result = await firstValueFrom(mutator.apply(currentPayload, form.value));

      const { portDetails } = result.aer.portEmissions.ports[0];

      expect(portDetails.arrivalTime).toBe('2022-01-01T01:00:00.000Z');
      expect(portDetails.departureTime).toBe('2022-01-01T01:00:00.000Z');
    });
  });
});
