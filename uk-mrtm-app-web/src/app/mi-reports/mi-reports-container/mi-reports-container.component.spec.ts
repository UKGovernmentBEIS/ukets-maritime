import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { AuthorityManagePermissionDTO, MiReportsUserDefinedService, RegulatorAuthoritiesService } from '@mrtm/api';

import { ActivatedRouteStub, asyncData, MockType } from '@netz/common/testing';

import { MiReportsContainerComponent } from '@mi-reports/mi-reports-container/mi-reports-container.component';

describe('MiReportsContainerComponent', () => {
  let component: MiReportsContainerComponent;
  let fixture: ComponentFixture<MiReportsContainerComponent>;
  let service: MockType<MiReportsUserDefinedService>;
  let regulatorAuthoritiesService: MockType<RegulatorAuthoritiesService>;

  const createComponent = async () => {
    fixture = TestBed.createComponent(MiReportsContainerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  };

  beforeEach(async () => {
    service = {
      getCategories: vi.fn().mockReturnValue(asyncData([])),
      getAllMiReportsUserDefined: vi.fn().mockReturnValue(asyncData({ queries: [], total: 0 })),
    };
    regulatorAuthoritiesService = {
      getCurrentRegulatorUserPermissionsByCa: vi
        .fn()
        .mockReturnValue(asyncData({ permissions: { MI_REPORTS_MANAGE_CUSTOM: 'EXECUTE' } })),
    };

    await TestBed.configureTestingModule({
      imports: [MiReportsContainerComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}, {}) },
        { provide: MiReportsUserDefinedService, useValue: service },
        { provide: RegulatorAuthoritiesService, useValue: regulatorAuthoritiesService },
      ],
    }).compileComponents();
  });

  it('should create', async () => {
    await createComponent();

    expect(component).toBeTruthy();
  });

  it('should allow adding a report when user has EXECUTE on MI_REPORTS_MANAGE_CUSTOM', async () => {
    await createComponent();

    expect(component.canAddMiReport()).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('Add a custom report');
  });

  it.each<AuthorityManagePermissionDTO['permissions'][string]>(['NONE', 'VIEW_ONLY'])(
    'should not allow adding a report when permission is %s',
    async (level) => {
      regulatorAuthoritiesService.getCurrentRegulatorUserPermissionsByCa.mockReturnValue(
        asyncData<AuthorityManagePermissionDTO>({ permissions: { MI_REPORTS_MANAGE_CUSTOM: level } }) as any,
      );
      await createComponent();

      expect(component.canAddMiReport()).toBe(false);
      expect(fixture.nativeElement.textContent).not.toContain('Add a custom report');
    },
  );
});
