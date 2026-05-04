import { computed, Directive, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, createUrlTreeFromSnapshot, Router } from '@angular/router';

import { PersistablePaginationService, PersistablePaginationState } from '@shared/services';
import { isNil } from '@shared/utils';

@Directive()
export abstract class PaginationStatePersistableComponent implements OnInit, OnDestroy {
  protected readonly activatedRoute = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly persistablePaginationService = inject(PersistablePaginationService);

  public readonly currentPersistableComponentState = computed(() => {
    const url = createUrlTreeFromSnapshot(this.activatedRoute.snapshot, ['.']).toString();
    return this.persistablePaginationService.getCurrentState(url);
  });

  public abstract getExtraState(): Pick<PersistablePaginationState, 'currentSorting' | 'activeFilters'>;

  public ngOnInit(): void {
    const state = this.currentPersistableComponentState();

    if (!isNil(state)) {
      this.router.navigate([], {
        queryParams: { page: state?.currentPage },
        queryParamsHandling: 'merge',
        relativeTo: this.activatedRoute,
      });
    }
  }

  public ngOnDestroy(): void {
    const { queryParams, fragment } = this.activatedRoute.snapshot ?? {};
    const url = createUrlTreeFromSnapshot(this.activatedRoute.snapshot, ['.']).toString();

    const currentState = this.persistablePaginationService.getCurrentState(url);

    this.persistablePaginationService.setCurrentState(url, {
      ...currentState,
      ...this.getExtraState(),
      currentPage: queryParams['page'] ?? 1,
      fragment,
    });
  }
}
