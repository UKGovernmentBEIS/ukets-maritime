import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { BehaviorSubject, of } from 'rxjs';

import { BREADCRUMB_ITEMS } from '@netz/common/navigation';
import { ITEM_NAME_TRANSFORMER, ItemNameTransformer } from '@netz/common/pipes';
import { RequestTaskStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { CANCEL_ACTIONS_MAP } from '../cancel-actions.providers';
import { CancelComponent } from './cancel.component';

describe('CancelComponent', () => {
  let component: CancelComponent;
  let fixture: ComponentFixture<CancelComponent>;
  let store: RequestTaskStore;
  let page: Page;

  const route = {
    paramMap: of(convertToParamMap({ taskId: 1 })),
    routeConfig: { path: 'cancel' },
    parent: { routeConfig: { path: '' } },
  };
  const breadcrumbs = new BehaviorSubject([{ text: 'Parent', link: [''] }]);
  const map = { ACCOUNT_CLOSURE_SUBMIT: 'Close account' };
  const transformer: ItemNameTransformer = (taskType) => map[taskType] ?? null;

  class Page extends BasePage<CancelComponent> {
    get caption() {
      return this.query('.govuk-caption-xl').textContent.trim();
    }

    get heading() {
      return this.query('.govuk-heading-xl').textContent.trim();
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ITEM_NAME_TRANSFORMER, useValue: transformer },
        {
          provide: CANCEL_ACTIONS_MAP,
          useValue: {
            ACCOUNT_CLOSURE_SUBMIT: {
              actionType: 'ACCOUNT_CLOSURE_CANCEL_APPLICATION',
              caption: 'Close account',
            },
          },
        },
        { provide: BREADCRUMB_ITEMS, useValue: breadcrumbs },
        { provide: ActivatedRoute, useValue: route },
      ],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(CancelComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(RequestTaskStore);
    store.setRequestTaskItem({ requestTask: { id: 1, type: 'ACCOUNT_CLOSURE_SUBMIT' } });
    page = new Page(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all HTML elements', () => {
    expect(page.caption).toBe('Close account');
    expect(page.heading).toBe('Are you sure you want to cancel this task?');
  });
});
