import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ITEM_LINK_REQUEST_TYPES_WHITELIST, ITEM_NAME_TRANSFORMER } from '@netz/common/pipes';

import { BasePage } from '../../testing';
import { RelatedTasksComponent } from './related-tasks.component';

describe('RelatedTasksComponent', () => {
  let component: RelatedTasksComponent;
  let fixture: ComponentFixture<RelatedTasksComponent>;
  let page: Page;

  class Page extends BasePage<RelatedTasksComponent> {
    get heading() {
      return this.query('h2');
    }
    get items() {
      return this.queryAll('.govuk-heading-s').map((el) => el.textContent.trim());
    }
    get daysRemaining() {
      return this.queryAll('.govuk-body').map((el) => el.textContent.trim());
    }
    get links() {
      return this.queryAll<HTMLLinkElement>('a');
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ITEM_NAME_TRANSFORMER, useValue: () => {} },
        { provide: ITEM_LINK_REQUEST_TYPES_WHITELIST, useValue: ['DUMMY_REQUEST_TYPE'] },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedTasksComponent);
    component = fixture.componentInstance;
    component.items = [
      {
        requestType: 'DUMMY_REQUEST_TYPE',
        taskType: 'DUMMY_REQUEST_TASK_TYPE2',
        taskId: 1,
        daysRemaining: 13,
      },
    ];
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display items', () => {
    expect(page.heading.textContent).toEqual('Related tasks');
    expect(page.daysRemaining).toEqual(['Days Remaining: 13']);
  });
});
