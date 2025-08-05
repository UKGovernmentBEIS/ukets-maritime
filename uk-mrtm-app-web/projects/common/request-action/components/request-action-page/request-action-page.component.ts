import { NgComponentOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Injector,
  runInInjectionContext,
  Signal,
  Type,
} from '@angular/core';

import { RequestActionDTO } from '@mrtm/api';

import {
  PageHeadingComponent,
  RELATED_PRINTABLE_ITEMS_MAP,
  RelatedPrintableItemsComponent,
  RelatedPrintableItemsMap,
  TaskListComponent,
} from '@netz/common/components';
import { TaskSection } from '@netz/common/model';
import { GovukDatePipe } from '@netz/common/pipes';
import { requestActionQuery, RequestActionStore } from '@netz/common/store';

import { REQUEST_ACTION_PAGE_CONTENT } from '../../request-action.providers';
import { RequestActionPageContentFactoryMap } from '../../request-action.types';

type ViewModel = {
  requestAction: RequestActionDTO;
  header: string;
  headerSize: 'l' | 'xl';
  sections: TaskSection[];
  component: Type<unknown>;
  caption?: string;
  printableComponent?: Component;
};

@Component({
  selector: 'netz-request-action-page',
  standalone: true,
  imports: [NgComponentOutlet, PageHeadingComponent, TaskListComponent, GovukDatePipe, RelatedPrintableItemsComponent],
  templateUrl: './request-action-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestActionPageComponent {
  private readonly contentFactoryMap = inject<RequestActionPageContentFactoryMap>(REQUEST_ACTION_PAGE_CONTENT);
  private readonly printableItemsMap = inject<RelatedPrintableItemsMap>(RELATED_PRINTABLE_ITEMS_MAP);
  private readonly store = inject(RequestActionStore);
  private readonly injector = inject(Injector);

  vm: Signal<ViewModel> = computed(() => {
    const requestAction = this.store.select(requestActionQuery.selectAction)();
    if (!requestAction) {
      return null;
    }

    const { header, headerSize, caption, sections, component } = runInInjectionContext(this.injector, () =>
      this.contentFactoryMap[requestAction.type](),
    );

    const printableComponent = this.printableItemsMap[requestAction?.type];

    return {
      requestAction,
      header,
      headerSize,
      caption,
      sections,
      component,
      printableComponent,
    };
  });
}
