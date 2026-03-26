import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { combineLatest, filter, map, merge, tap } from 'rxjs';

import {
  ErrorSummaryComponent,
  NotificationBannerComponent as GovukNotificationBannerComponent,
} from '@netz/govuk-components';

import {
  NotificationBannerStore,
  selectInvalidForm,
  selectSuccessMessages,
  selectType,
} from '@shared/components/notification-banner';

@Component({
  selector: 'mrtm-notification-banner',
  imports: [AsyncPipe, GovukNotificationBannerComponent, ErrorSummaryComponent],
  standalone: true,
  templateUrl: './notification-banner.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationBannerComponent implements OnInit, OnDestroy {
  private readonly bannerContEl = viewChild<ElementRef<HTMLDivElement>>('bannerContainer');
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly store = inject(NotificationBannerStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly title = inject(Title);

  readonly preventResetOnNavigation = input<boolean>(false);

  /** Auxiliary property to avoid resetting the store at each navigation change. */
  private storeToReset = false;

  notificationInfo$ = combineLatest([
    this.store.rxSelect(selectType),
    this.store.rxSelect(selectSuccessMessages),
    this.store.rxSelect(selectInvalidForm),
  ]).pipe(
    map(([type, successMessages, invalidForm]) => {
      if (!type || (!successMessages?.length && !invalidForm)) {
        return null;
      }
      this.bannerContEl()?.nativeElement.scrollIntoView({ behavior: 'instant' });
      this.storeToReset = true;

      const currentTitle = this.title.getTitle();
      const prefix = 'Error: ';

      if (type !== 'success' && !currentTitle.startsWith(prefix)) {
        this.title.setTitle(prefix.concat(currentTitle));
      } else if (type === 'success') {
        this.title.setTitle(currentTitle.replace(prefix, ''));
      }

      if (type === 'success') {
        return { type, successMessages };
      } else if (type === 'error') {
        return { type, invalidForm };
      }
      return null;
    }),
  );

  ngOnInit(): void {
    // The functionality below checks for either a navigation-end or fragment-change event (in case of a simple tab
    // change) in order to reset the store (if needed), so that any displayed notification is hidden automatically.
    const navigationEnd$ = this.router.events.pipe(filter((event) => event instanceof NavigationEnd));
    const fragmentChange$ = this.activatedRoute.fragment;
    merge(navigationEnd$, fragmentChange$)
      .pipe(
        tap(() => this.preventResetOnNavigation() || this.resetStore()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private resetStore() {
    if (this.storeToReset) {
      this.store.reset();
      this.storeToReset = false;
    }
  }

  ngOnDestroy(): void {
    // The component is being destroyed. Reset the store (where applicable).
    this.resetStore();
  }
}
