import { computed, DestroyRef, Service, signal } from '@angular/core';

/**
 * Controls the visibility of the standard service feedback link in the phase banner,
 * which is hidden while a request feedback workflow is in progress.
 */
@Service()
export class ServiceFeedbackLinkService {
  private readonly hideRequests = signal(0);
  readonly isVisible = computed(() => this.hideRequests() === 0);

  hideUntilDestroyed(destroyRef: DestroyRef): void {
    this.hideRequests.update((count) => count + 1);
    destroyRef.onDestroy(() => this.hideRequests.update((count) => count - 1));
  }
}
