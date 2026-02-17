import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { GuidanceStore } from '@guidance/+state';
import { GuidanceListComponent } from '@guidance/guidance-list';
import { mockGuidanceSections } from '@guidance/testing/guidance-data.mock';
import { KeycloakService } from '@shared/services';

describe('GuidanceListComponent', () => {
  class Page extends BasePage<GuidanceListComponent> {}

  let component: GuidanceListComponent;
  let fixture: ComponentFixture<GuidanceListComponent>;
  let page: Page;
  let guidanceStore: GuidanceStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuidanceListComponent],
      providers: [KeycloakService, { provide: ActivatedRoute, useValue: new ActivatedRouteStub() }],
    }).compileComponents();

    guidanceStore = TestBed.inject(GuidanceStore);
    guidanceStore.setIsEditable(false);

    fixture = TestBed.createComponent(GuidanceListComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toEqual('Guidance');
    expect(page.query('p.guidance__description').textContent).toEqual(
      'Guidance and information about using the service.',
    );
  });

  it('should display buttons group for regulators only', () => {
    expect(page.query('mrtm-dropdown-button-group')).toBeFalsy();
    guidanceStore.setIsEditable(true);
    fixture.detectChanges();

    expect(page.query('mrtm-dropdown-button-group')).toBeTruthy();
  });

  it('should display guidance sections only with documents for Operators and Verifiers', () => {
    guidanceStore.setGuidanceSections({ ENGLAND: mockGuidanceSections });
    fixture.detectChanges();

    expect(page.queryAll('h3').map((el) => el.textContent)).toEqual(
      mockGuidanceSections.filter((section) => section?.guidanceDocuments?.length).map((section) => section.name),
    );
  });

  it('should display all guidance sections for Regulators', () => {
    guidanceStore.setGuidanceSections({ ENGLAND: mockGuidanceSections });
    guidanceStore.setIsEditable(true);
    fixture.detectChanges();

    expect(page.queryAll('h3').map((el) => el.textContent)).toEqual(
      mockGuidanceSections.map((section) => section.name),
    );
  });
});
