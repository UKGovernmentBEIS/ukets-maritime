import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { AerAggregatedDataEmissionsForSmallIslandComponent } from '@requests/common/aer/subtasks/aer-aggregated-data/aer-aggregated-data-emissions-for-small-island/aer-aggregated-data-emissions-for-small-island.component';
import { taskProviders } from '@requests/common/task.providers';

describe('AerAggregatedDataEmissionsForSmallIslandComponent', () => {
  class Page extends BasePage<AerAggregatedDataEmissionsForSmallIslandComponent> {}

  let component: AerAggregatedDataEmissionsForSmallIslandComponent;
  let fixture: ComponentFixture<AerAggregatedDataEmissionsForSmallIslandComponent>;
  let page: Page;
  const activatedRouteMock = new ActivatedRouteStub();
  const taskServiceMock: MockType<TaskService<any>> = {};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AerAggregatedDataEmissionsForSmallIslandComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: TaskService, useValue: taskServiceMock },
        ...taskProviders,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AerAggregatedDataEmissionsForSmallIslandComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTMLElements and form with 0 errors', () => {
    expect(page.errorSummary).toBeFalsy();
    expect(page.heading1).toBeTruthy();
    expect(page.heading1.textContent.trim()).toEqual(
      'Emissions eligible for small island ferry operator surrender reduction',
    );

    expect(page.submitButton).toBeTruthy();
    expect(page.query('a').textContent).toEqual('Return to: Aggregated data for ships');
  });

  it('should display error on empty form submit', () => {
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummary).toBeTruthy();
    expect(page.errorSummaryListContents.length).toEqual(6);

    expect(page.errorSummaryListContents).toEqual([
      'Must accept only positive numbers or zero',
      'Must accept only positive numbers or zero',
      'Must accept only positive numbers or zero',
      'Must accept only positive numbers or zero',
      'Enter emissions eligible for small island ferry operator surrender reduction',
      'Must accept only positive numbers or zero',
    ]);
  });

  it('should display error for invalid data', () => {
    page.setInputValue('#smallIslandSurrenderReduction.co2', 'testIncorrectValue');
    page.setInputValue('#smallIslandSurrenderReduction.ch4', 0.12332125);
    page.setInputValue('#smallIslandSurrenderReduction.n2o', -10);
    page.submitButton.click();
    fixture.detectChanges();

    expect(page.errorSummaryListContents).toEqual(
      expect.arrayContaining([
        'Enter a number up to 7 decimal places',
        'Must accept only positive numbers or zero',
        'Enter emissions eligible for small island ferry operator surrender reduction',
      ]),
    );
  });
});
