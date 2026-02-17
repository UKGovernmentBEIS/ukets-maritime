import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '@netz/common/forms';
import { ActivatedRouteStub, BasePage, MockType } from '@netz/common/testing';

import { AerFetchShipsFromEmpComponent } from '@requests/common/aer/subtasks/aer-emissions/aer-fetch-ships-from-emp/aer-fetch-ships-from-emp.component';
import { aerEmissionsMap } from '@requests/common/aer/subtasks/aer-subtasks-list.map';
import { taskProviders } from '@requests/common/task.providers';

describe('AerFetchShipsFromEmpComponent', () => {
  let component: AerFetchShipsFromEmpComponent;
  let fixture: ComponentFixture<AerFetchShipsFromEmpComponent>;
  let page: Page;

  const taskService: MockType<any> = {
    fetchShipsFromEMP: jest.fn().mockReturnValue(of({})),
  };

  const taskServiceSpy = jest.spyOn(taskService, 'fetchShipsFromEMP');

  class Page extends BasePage<AerFetchShipsFromEmpComponent> {
    get warnText(): HTMLElement {
      return this.query<HTMLElement>('strong');
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AerFetchShipsFromEmpComponent],
      providers: [
        { provide: ActivatedRoute, useValue: new ActivatedRouteStub({}) },
        { provide: TaskService, useValue: taskService },
        ...taskProviders,
      ],
    });

    fixture = TestBed.createComponent(AerFetchShipsFromEmpComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.heading1.textContent).toEqual(aerEmissionsMap.fetchFromEMP.title);
    expect(page.warnText.textContent).toEqual(
      'If you import the ships from the Emissions Monitoring Plan (EMP), all of the data that has been entered will be replaced.',
    );
    expect(page.standardButton.textContent).toEqual('Yes, import ships from EMP');
    expect(page.link.textContent).toEqual('Return to: Add ships and emission details');
  });

  it('should trigger fetch ships from EMP', () => {
    page.standardButton.click();
    fixture.detectChanges();

    expect(taskServiceSpy).toHaveBeenCalledTimes(1);
  });
});
