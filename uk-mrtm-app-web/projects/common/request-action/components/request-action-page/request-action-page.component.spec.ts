import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RELATED_PRINTABLE_ITEMS_MAP } from '@netz/common/components';
import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '@netz/common/pipes';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { RelatedPrintableItemsMap } from '../../../components';
import { REQUEST_ACTION_PAGE_CONTENT } from '../../request-action.providers';
import { RequestActionPageContentFactoryMap } from '../../request-action.types';
import { RequestActionPageComponent } from './request-action-page.component';

@Component({
  standalone: true,
  template: `
    <h1>TEST CONTENT</h1>
  `,
})
class MockContentComponent {}

const sections = [
  {
    title: 'TEST_SECTION_1',
    tasks: [{ link: '.', linkText: 'TEST_SUBTASK_1_1', status: 'COMPLETED' }],
  },
  {
    title: 'TEST_SECTION_2',
    tasks: [{ link: '.', linkText: 'TEST_SUBTASK_2_1', status: 'COMPLETED' }],
  },
];

function getContent(type: 'component' | 'sections'): RequestActionPageContentFactoryMap {
  return {
    RFI_SUBMITTED: () => {
      const store = inject(RequestActionStore);
      const submitter = store.select(requestActionQuery.selectSubmitter)();
      return {
        header: `Original application submitted by ${submitter}`,
        component: type === 'component' ? MockContentComponent : undefined,
        sections: type === 'sections' ? sections : undefined,
      };
    },
  };
}

describe('RequestActionComponent', () => {
  let component: RequestActionPageComponent;
  let fixture: ComponentFixture<RequestActionPageComponent>;
  let store: RequestActionStore;
  let page: Page;

  const map: TaskStatusTagMap = { COMPLETED: { text: 'COMPLETED', color: 'blue' } };
  const relatedPrintableItemsMap: RelatedPrintableItemsMap = {};

  class Page extends BasePage<RequestActionPageComponent> {}

  function createTestModule(content: RequestActionPageContentFactoryMap) {
    TestBed.configureTestingModule({
      imports: [RequestActionPageComponent],
      providers: [
        provideRouter([]),
        { provide: REQUEST_ACTION_PAGE_CONTENT, useValue: content },
        { provide: TASK_STATUS_TAG_MAP, useValue: map },
        { provide: RELATED_PRINTABLE_ITEMS_MAP, useValue: relatedPrintableItemsMap },
      ],
    });

    store = TestBed.inject(RequestActionStore);
    store.setAction({
      type: 'RFI_SUBMITTED',
      submitter: 'Darth Vader',
    });

    fixture = TestBed.createComponent(RequestActionPageComponent);
    component = fixture.componentInstance;
    page = new Page(fixture);
    fixture.detectChanges();
  }

  it('should create', () => {
    createTestModule(getContent('component'));
    expect(component).toBeTruthy();
  });

  it('should show content with custom component', () => {
    createTestModule(getContent('component'));
    expect(page.queryAll('h1').map((h) => h.textContent)).toContain('TEST CONTENT');
  });

  it('should show content with sections', () => {
    createTestModule(getContent('sections'));
    expect(page.queryAll('h2').map((h) => h.textContent)).toContain('TEST_SECTION_1');
    expect(page.link.textContent).toContain('TEST_SUBTASK_1_1');
    expect(page.queryAll('h2').map((h) => h.textContent)).toContain('TEST_SECTION_2');
    expect(page.queryAll('a').map((a) => a.textContent)).toContain('TEST_SUBTASK_2_1');
  });
});
