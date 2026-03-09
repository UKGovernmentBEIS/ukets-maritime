import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';

import { BackLinkComponent as GovukBackLinkComponent } from '@netz/govuk-components';

import { getActiveRoute } from '../navigation.util';
import { RouteBacklink } from './backlink.interface';

@Component({
  selector: 'netz-back-link',
  standalone: true,
  template: `
    @if (backlink$ | async; as backlink) {
      <govuk-back-link
        [link]="backlink.link"
        [route]="backlink.route"
        [fragment]="backlink?.fragment"
        [inverse]="inverse"></govuk-back-link>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GovukBackLinkComponent, AsyncPipe],
})
export class BackLinkComponent {
  readonly router = inject(Router);
  private readonly destroy$ = inject(DestroyRef);

  @Input() inverse = false;
  protected backlink$ = new BehaviorSubject<{ link: string; route: ActivatedRouteSnapshot; fragment?: string }>(null);

  constructor() {
    const router = this.router;

    router.events
      .pipe(
        takeUntilDestroyed(this.destroy$),
        filter((event) => event instanceof NavigationEnd),
      )
      .subscribe(() => {
        const activeRoute = getActiveRoute(router, true);

        if (this.hasBackLink(activeRoute.data)) {
          this.backlink$.next({
            link: this.getLink(activeRoute),
            route: activeRoute,
            fragment: this.getLinkFragment(activeRoute),
          });
        } else {
          this.backlink$.next(null);
        }
      });
  }

  private getLink(route: ActivatedRouteSnapshot): string {
    switch (typeof route.data.backlink) {
      case 'function':
        return route.data.backlink(route.data);
      case 'string':
      default:
        return route.data.backlink;
    }
  }

  private getLinkFragment(route: ActivatedRouteSnapshot): string {
    switch (typeof route.data.backlinkFragment) {
      case 'function':
        return route.data.backlinkFragment(route.data);
      case 'string':
      default:
        return route.data.backlinkFragment;
    }
  }

  private hasBackLink(routeData: Data): boolean {
    if (!routeData) return false;
    const backlink: RouteBacklink = routeData.backlink;
    if (typeof backlink === 'boolean' || typeof backlink === 'string') return !!backlink;
    if (typeof backlink === 'function') return !!backlink(routeData);
  }
}
