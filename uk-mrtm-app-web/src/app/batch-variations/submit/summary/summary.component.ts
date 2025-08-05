import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { map, take } from 'rxjs';

import { RegulatorAuthoritiesService } from '@mrtm/api';

import { PageHeadingComponent } from '@netz/common/components';
import { PendingButtonDirective } from '@netz/common/directives';
import { ButtonDirective } from '@netz/govuk-components';

import { batchVariationsQuery, BatchVariationStore } from '@batch-variations/+state';
import { BatchVariationService } from '@batch-variations/services/batch-variation.service';
import { SubmitWizardSteps } from '@batch-variations/submit/submit.helpers';
import { BatchVariationSummaryTemplateComponent } from '@shared/components';
import { BatchVariationSummaryModel } from '@shared/types';

interface ViewModel {
  isEditable: boolean;
  data: BatchVariationSummaryModel;
  queryParams: Params;
  wizardStep: Record<string, string>;
}

@Component({
  selector: 'mrtm-summary',
  standalone: true,
  imports: [PageHeadingComponent, BatchVariationSummaryTemplateComponent, PendingButtonDirective, ButtonDirective],
  templateUrl: './summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryComponent {
  private readonly router: Router = inject(Router);
  private readonly activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly service: BatchVariationService = inject(BatchVariationService);
  private readonly store: BatchVariationStore = inject(BatchVariationStore);
  private readonly regulatorAuthoritiesService: RegulatorAuthoritiesService = inject(RegulatorAuthoritiesService);

  private readonly regulators = toSignal(
    this.regulatorAuthoritiesService.getCaRegulators().pipe(
      map((data) => data?.caUsers?.filter((user) => user.authorityStatus === 'ACTIVE')),
      map((regulators) =>
        regulators.map(({ userId, firstName, lastName }) => ({
          text: `${firstName} ${lastName}`,
          value: userId,
        })),
      ),
    ),
  );

  public readonly vm: Signal<ViewModel> = computed(() => {
    const currentItem = this.store.select(batchVariationsQuery.selectCurrentItemSummaryModel)();

    if (currentItem && this.regulators()) {
      currentItem.signatory = this.regulators()?.find((x) => x.value === currentItem.signatory)?.text;
    }

    return {
      isEditable: true,
      data: currentItem,
      queryParams: { change: true },
      wizardStep: SubmitWizardSteps,
    };
  });

  public onSubmit(): void {
    this.service
      .submit()
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['success'], { relativeTo: this.activatedRoute, skipLocationChange: false });
      });
  }
}
