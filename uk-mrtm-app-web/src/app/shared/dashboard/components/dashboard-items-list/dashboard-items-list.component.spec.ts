import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ITEM_LINK_REQUEST_TYPES_WHITELIST, ITEM_NAME_TRANSFORMER } from '@netz/common/pipes';

import { DashboardItemsListComponent } from '@shared/dashboard';
import * as mocks from '@shared/dashboard/testing';
import { taskActionTypeToTitleTransformer } from '@shared/utils';

@Component({
  imports: [DashboardItemsListComponent],
  standalone: true,
  template: `
    <mrtm-dashboard-items-list [items]="items" [tableColumns]="tableColumns" unassignedLabel="Unassigned" />
  `,
})
class TestParentComponent {
  items = mocks.assignedItems;
  tableColumns = mocks.columns;
}

describe('WorkflowItemsListComponent', () => {
  let component: TestParentComponent;
  let fixture: ComponentFixture<TestParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ITEM_NAME_TRANSFORMER, useValue: taskActionTypeToTitleTransformer },
        { provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: ['DUMMY_REQUEST_TYPE'] },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show data in table', () => {
    const cells = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('td'));
    expect(cells.map((cell) => cell.textContent.trim())).toEqual([...['', 'TEST_FN TEST_LN', '10']]);
  });
});
