import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';

import {
  ITEM_TYPE_TO_RETURN_TEXT_MAPPER,
  RequestActionStore,
  RequestTaskStore,
  selectRequestId,
  selectType,
  TYPE_AWARE_STORE,
} from '@netz/common/store';
import { getYearFromRequestId } from '@netz/common/utils';
import { LinkDirective } from '@netz/govuk-components';

@Component({
  selector: 'netz-return-to-task-or-action-page',
  standalone: true,
  imports: [RouterLinkWithHref, LinkDirective],
  template: `
    <a govukLink [routerLink]="returnToUrl()">Return to: {{ returnToText() }}</a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToTaskOrActionPageComponent {
  private readonly store = inject<RequestTaskStore | RequestActionStore>(TYPE_AWARE_STORE, { optional: true })!;
  private readonly typeToText = inject(ITEM_TYPE_TO_RETURN_TEXT_MAPPER, { optional: true })!;
  private readonly route = inject(ActivatedRoute);

  readonly requestTaskIdRouteParam = input(':taskId');
  readonly requestActionIdRouteParam = input(':actionId');

  readonly returnToUrl = signal(['']);
  readonly returnToText = computed(() => {
    if (!!this.store && !!this.typeToText) {
      const type = this.store.select(selectType)();
      const requestId = this.store.select(selectRequestId)();
      const year = getYearFromRequestId(requestId);
      return this.typeToText(type, year) ?? 'Dashboard';
    }

    console.warn(`
      ReturnToTaskOrActionPageComponent ::
      No TYPE_AWARE_STORE and/or ITEM_TYPE_TO_RETURN_TEXT_MAPPER dependency found
    `);
    return 'Dashboard';
  });

  constructor() {
    let returnRoute = this.route;

    while (!!returnRoute.parent && !this.hasActionOrTaskIdRouteParam(returnRoute)) {
      returnRoute = returnRoute.parent;
    }

    const url = returnRoute.snapshot.pathFromRoot.map((route) => route.url.map((u) => u.path)).flat();
    url[0] = `/${url[0]}`;
    this.returnToUrl.set(url);
  }

  private hasActionOrTaskIdRouteParam(returnRoute: ActivatedRoute): boolean {
    return [this.requestActionIdRouteParam(), this.requestTaskIdRouteParam()].includes(returnRoute.routeConfig?.path);
  }
}
