import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PageHeadingComponent } from '@netz/common/components';
import { RequestActionStore } from '@netz/common/store';

import { virSubtaskList } from '@requests/common/vir';
import { virSubmittedQuery } from '@requests/timeline/vir-submitted/+state';
import { VirVerifierRecommendationSummaryTemplateComponent } from '@shared/components';
import { VirOperatorResponseSummaryTemplateComponent } from '@shared/components/summaries/vir-operator-response-summary-template';

@Component({
  selector: 'mrtm-vir-submitted-recommendations',
  standalone: true,
  imports: [
    PageHeadingComponent,
    VirVerifierRecommendationSummaryTemplateComponent,
    VirOperatorResponseSummaryTemplateComponent,
  ],
  templateUrl: './vir-submitted-recommendations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirSubmittedRecommendationsComponent {
  private readonly store = inject(RequestActionStore);
  public readonly key = input<string>();

  public readonly verificationData = computed(() => {
    const key = this.key();
    const data = this.store.select(virSubmittedQuery.selectVirVerifierRecommendationDataByKey(key))();
    return {
      ...data,
      reference: `${data?.reference}: ${virSubtaskList[data?.verificationDataKey]?.title}`,
    };
  });

  public readonly operatorResponseData = computed(() =>
    this.store.select(virSubmittedQuery.selectOperatorResponseSummaryData(this.key()))(),
  );
}
