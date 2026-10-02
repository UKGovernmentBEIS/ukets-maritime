import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { RequestTaskItemDTO } from '@mrtm/api';

import { FeedbackBannerComponent, TASK_RELATED_ACTIONS_MAP } from '@netz/common/components';
import { TaskSection } from '@netz/common/model';
import { TASK_STATUS_TAG_MAP, TaskStatusTagMap } from '@netz/common/pipes';
import { RequestTaskStore } from '@netz/common/store';
import { BasePage } from '@netz/common/testing';

import { REQUEST_TASK_PAGE_CONTENT } from '../../request-task.providers';
import { RequestTaskPageContentFactory, RequestTaskPageContentFactoryMap } from '../../request-task.types';
import { FINAL_DOCUMENTS_IN_PROGRESS_BANNER, RequestTaskPageComponent } from './request-task-page.component';

let dynamicSectionsFlag = true;

@Component({
  selector: 'netz-test-content',
  standalone: true,
  template: `
    <h1>Test content component</h1>
  `,
})
class TestContentComponent {}

@Component({
  selector: 'netz-test-pre-content',
  standalone: true,
  template: `
    <h2>Test pre content</h2>
  `,
})
class TestPreContentComponent {}

@Component({
  selector: 'netz-test-post-header',
  standalone: true,
  template: `
    <h2>Test post header content</h2>
  `,
})
class TestPostHeaderComponent {}

@Component({
  selector: 'netz-test-post-content',
  standalone: true,
  template: `
    <h2>Test post content</h2>
  `,
})
class TestPostContentComponent {}

@Component({
  selector: 'netz-subtask',
  standalone: true,
  template: '<h1>SUBTASK COMPONENT</h1>',
})
class TestSubtaskComponent {}

const sectionsA: TaskSection[] = [
  {
    title: 'SECTION_A_TITLE',
    tasks: [
      {
        link: 'test-link',
        linkText: 'TEST_SUBTASK_A',
        status: 'Completed',
      },
    ],
  },
];

const sectionsB: TaskSection[] = [
  {
    title: 'SECTION_B_TITLE',
    tasks: [
      {
        link: 'test-link',
        linkText: 'TEST_SUBTASK_B',
        status: 'Completed',
      },
    ],
  },
];

const statusTagMap: TaskStatusTagMap = { Completed: { text: 'Completed', color: 'blue', style: 'fill' } };

const contentWithSections: Record<string, RequestTaskPageContentFactory> = {
  TEST_TYPE: () => ({
    header: 'TEST_TYPE_HEADER',
    sections: sectionsA,
  }),
};

const contentWithBanner: Record<string, RequestTaskPageContentFactory> = {
  TEST_TYPE: () => ({
    header: 'TEST_TYPE_HEADER',
    sections: sectionsA,
    pageTopComponent: FeedbackBannerComponent,
  }),
};

const contentWithDynamicSections: RequestTaskPageContentFactoryMap = {
  TEST_TYPE: () => {
    return {
      header: 'TEST_TYPE_HEADER',
      sections: dynamicSectionsFlag ? sectionsA : sectionsB,
    };
  },
};

const contentWithComponent: Record<string, RequestTaskPageContentFactory> = {
  TEST_TYPE: () => ({
    header: 'TEST_TYPE_HEADER',
    contentComponent: TestContentComponent,
    postHeaderComponent: TestPostHeaderComponent,
    preContentComponent: TestPreContentComponent,
    postContentComponent: TestPostContentComponent,
  }),
};

describe('RequestTaskPageComponent', () => {
  let store: RequestTaskStore;
  let component: RequestTaskPageComponent;
  let harness: RouterTestingHarness;
  let page: Page;

  class Page extends BasePage<RequestTaskPageComponent> {
    get headings2(): HTMLHeadingElement[] {
      return this.queryAll<HTMLHeadingElement>('h2');
    }

    get sidebar(): HTMLElement {
      return this.query<HTMLElement>('netz-related-actions');
    }

    get notificationBanner(): HTMLElement {
      return this.query<HTMLElement>('govuk-notification-banner');
    }
  }

  async function createModule(
    content: RequestTaskPageContentFactoryMap,
    requestTaskItem: RequestTaskItemDTO = { requestTask: { type: 'TEST_TYPE' as any } },
  ) {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: '', component: RequestTaskPageComponent },
          { path: 'subtask', component: TestSubtaskComponent },
        ]),
        { provide: REQUEST_TASK_PAGE_CONTENT, useValue: content },
        { provide: TASK_STATUS_TAG_MAP, useValue: statusTagMap },
        { provide: TASK_RELATED_ACTIONS_MAP, useValue: {} },
      ],
    });

    store = TestBed.inject(RequestTaskStore);
    store.setRequestTaskItem(requestTaskItem);

    harness = await RouterTestingHarness.create();
    component = await harness.navigateByUrl('/', RequestTaskPageComponent);
    page = new Page(harness.fixture as any);
    harness.detectChanges();
  }

  afterEach(() => {
    dynamicSectionsFlag = true;
  });

  it('should create', async () => {
    await createModule(contentWithSections);
    expect(component).toBeTruthy();
  });

  it('should show sections provided', async () => {
    await createModule(contentWithSections);
    expect(page.listContents).toEqual(['SECTION_A_TITLETEST_SUBTASK_A Completed', 'TEST_SUBTASK_A Completed']);
  });

  it('should show components provided', async () => {
    await createModule(contentWithComponent);
    expect(page.heading1.textContent).toContain('TEST_TYPE_HEADER');
    expect(page.queryAll('h1').map((h) => h.textContent)).toContain('Test content component');
    expect(page.headings2.map((h) => h.textContent)).toEqual([
      'Test post header content',
      'Test pre content',
      'Test post content',
    ]);
  });

  it('should show the sidebar when the task is assignable and no final documents are being generated', async () => {
    await createModule(contentWithBanner, {
      userAssignCapable: true,
      allowedRequestTaskActions: [],
      requestTask: { type: 'TEST_TYPE' as any, assignable: true, payload: {} as any },
    });

    expect(component.vm().hasSidebar).toBe(true);
    expect(page.sidebar).toBeTruthy();
    expect(page.notificationBanner).toBeFalsy();
  });

  it('should hide the sidebar and show the in progress banner while final documents are being generated', async () => {
    await createModule(contentWithBanner, {
      userAssignCapable: true,
      requestTask: {
        type: 'TEST_TYPE' as any,
        assignable: true,
        payload: { finalDocumentsGenerationInProgress: true } as any,
      },
    });

    expect(component.vm().hasSidebar).toBe(false);
    expect(page.sidebar).toBeFalsy();
    expect(page.notificationBanner.textContent).toContain(FINAL_DOCUMENTS_IN_PROGRESS_BANNER.heading);
    expect(page.notificationBanner.textContent).toContain(FINAL_DOCUMENTS_IN_PROGRESS_BANNER.body);
  });

  it('should show changed sections for same task type after navigation', async () => {
    await createModule(contentWithDynamicSections);
    await harness.navigateByUrl('subtask', TestSubtaskComponent);
    dynamicSectionsFlag = false;
    await harness.navigateByUrl('', RequestTaskPageComponent);
    expect(page.query('li').textContent).toContain('SECTION_B_TITLE');
  });
});
