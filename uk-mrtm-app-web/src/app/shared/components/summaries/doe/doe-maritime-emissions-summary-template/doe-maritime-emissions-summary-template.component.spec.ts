import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { UserStateDTO } from '@mrtm/api';

import { AuthStore } from '@netz/common/auth';
import { ActivatedRouteStub, BasePage } from '@netz/common/testing';

import { doeTotalMaritimeEmissionsMap, maritimeEmissionsMap } from '@requests/common/doe/subtasks/subtask-list.map';
import { DoeMaritimeEmissionsSummaryTemplateComponent } from '@shared/components/summaries/doe/doe-maritime-emissions-summary-template';

describe('DoeMaritimeEmissionsSummaryTemplateComponent', () => {
  let component: DoeMaritimeEmissionsSummaryTemplateComponent;
  let fixture: ComponentFixture<DoeMaritimeEmissionsSummaryTemplateComponent>;
  let authStore: AuthStore;
  let page: Page;
  const route = new ActivatedRouteStub();

  class Page extends BasePage<DoeMaritimeEmissionsSummaryTemplateComponent> {}

  const createComponent = async (roleType: UserStateDTO['roleType']) => {
    await TestBed.configureTestingModule({
      imports: [DoeMaritimeEmissionsSummaryTemplateComponent],
      providers: [{ provide: ActivatedRoute, useValue: route }],
    }).compileComponents();

    authStore = TestBed.inject(AuthStore);
    authStore.setUserState({ ...authStore.state.userState, roleType, userId: 'opTestId', status: 'ENABLED' });

    fixture = TestBed.createComponent(DoeMaritimeEmissionsSummaryTemplateComponent);
    fixture.componentRef.setInput('data', {});
    fixture.componentRef.setInput('map', maritimeEmissionsMap);
    fixture.componentRef.setInput('doeTotalMaritimeEmissionsMap', doeTotalMaritimeEmissionsMap);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  };

  it('should create', async () => {
    await createComponent('OPERATOR');
    expect(component).toBeTruthy();
  });

  describe('for OPERATOR', () => {
    beforeEach(async () => {
      await createComponent('OPERATOR');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements', () => {
      expect(page.summariesContents).toEqual([
        'Why are you determining the maritime emissions or emissions figure for surrender?',
        'Not provided',
        'Select whether you are determining maritime emissions or only the emissions figure for surrender',
        'Not provided',
        'Total maritime emissions',
        'Not provided',
        'Less small island ferry deduction',
        'Not provided',
        'Less 5% ice class deduction',
        'Not provided',
        'Emissions figure for surrender',
        'Not provided',
        'How have you calculated the emissions?',
        'Not provided',
        'Supporting documents',
        'Not provided',
        'Do you need to charge the operator a fee?',
        'Not provided',
      ]);
    });
  });

  describe('for REGULATOR', () => {
    beforeEach(async () => {
      await createComponent('REGULATOR');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display all HTMLElements', () => {
      expect(page.summariesContents).toEqual([
        'Why are you determining the maritime emissions or emissions figure for surrender?',
        'Not provided',
        'Further details',
        'Not provided',
        'Select whether you are determining maritime emissions or only the emissions figure for surrender',
        'Not provided',
        'Total maritime emissions',
        'Not provided',
        'Less small island ferry deduction',
        'Not provided',
        'Less 5% ice class deduction',
        'Not provided',
        'Emissions figure for surrender',
        'Not provided',
        'How have you calculated the emissions?',
        'Not provided',
        'Supporting documents',
        'Not provided',
        'Do you need to charge the operator a fee?',
        'Not provided',
      ]);
    });
  });
});
