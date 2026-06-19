import { computed } from '@angular/core';

import { EmpIssuanceDetermination, EmpNotificationReviewDecision, EmpVariationDetermination } from '@mrtm/api';

import { RelatedPreviewDocumentsMap } from '@netz/common/components';
import { RequestTaskStore } from '@netz/common/store';

import { empReviewQuery } from '@requests/common/emp/+state/emp-review.selectors';
import { empVariationReviewQuery } from '@requests/common/emp/+state/emp-variation-review.selectors';
import { nocReviewQuery } from '@requests/common/emp/+state/noc-review.selectors';

const empReviewPreviewDocumentsTypeMap: Record<EmpIssuanceDetermination['type'], string> = {
  APPROVED: 'EMP_ISSUANCE_GRANTED',
  DEEMED_WITHDRAWN: 'EMP_ISSUANCE_DEEMED_WITHDRAWN',
};

const empVariationReviewPreviewDocumentTypesMap: Record<EmpVariationDetermination['type'], string> = {
  APPROVED: 'EMP_VARIATION_ACCEPTED',
  REJECTED: 'EMP_VARIATION_REJECTED',
  DEEMED_WITHDRAWN: 'EMP_VARIATION_DEEMED_WITHDRAWN',
};

const nocReviewPreviewDocumentTypesMap: Record<EmpNotificationReviewDecision['type'], string> = {
  ACCEPTED: 'EMP_NOTIFICATION_ACCEPTED',
  REJECTED: 'EMP_NOTIFICATION_REFUSED',
};

export const taskRelatedPreviewDocumentsMapFactory = (store: RequestTaskStore): RelatedPreviewDocumentsMap =>
  computed(() => {
    const empReviewDetermination = store.select(empReviewQuery.selectDetermination)();
    const hasEmpReviewTermination = !!empReviewDetermination?.type;
    const empVariationReviewDetermination = store.select(empVariationReviewQuery.selectDetermination)();
    const hasEmpVariationReviewDetermination = !!empVariationReviewDetermination?.type;
    const nocReviewDecision = store.select(nocReviewQuery.selectReviewDecision)();
    const hasNocReviewDecision = !!nocReviewDecision?.type;
    const empIssuancePreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: empReviewPreviewDocumentsTypeMap[empReviewDetermination?.type],
        visibleInRelatedActions: hasEmpReviewTermination,
        visibleInNotify: true,
      },
      {
        filename: 'emissions_monitoring_plan_preview.pdf',
        documentType: 'EMP',
        visibleInRelatedActions: true,
        visibleInNotify: empReviewDetermination?.type === 'APPROVED',
      },
    ];
    const empVariationPreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: empVariationReviewPreviewDocumentTypesMap[empVariationReviewDetermination?.type],
        visibleInRelatedActions: hasEmpVariationReviewDetermination,
        visibleInNotify: true,
      },
      {
        filename: 'emissions_monitoring_plan_preview.pdf',
        documentType: 'EMP',
        visibleInRelatedActions: true,
        visibleInNotify: empVariationReviewDetermination?.type === 'APPROVED',
      },
    ];
    const empVariationRegulatorLedPreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: 'EMP_VARIATION_REGULATOR_LED_APPROVED',
        visibleInRelatedActions: true,
        visibleInNotify: true,
      },
      {
        filename: 'emissions_monitoring_plan_preview.pdf',
        documentType: 'EMP',
        visibleInRelatedActions: true,
        visibleInNotify: true,
      },
    ];
    const empNotificationPreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: nocReviewPreviewDocumentTypesMap[nocReviewDecision?.type],
        visibleInRelatedActions: hasNocReviewDecision,
        visibleInNotify: true,
      },
    ];
    const doeSubmitPreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: 'DOE_SUBMITTED',
        visibleInRelatedActions: false,
        visibleInNotify: true,
      },
    ];

    const virApplicationReviewPreviewDocuments = [
      {
        filename: 'letter_preview.pdf',
        documentType: 'VIR_REVIEWED',
        visibleInRelatedActions: false,
        visibleInNotify: true,
      },
    ];

    return {
      EMP_ISSUANCE_APPLICATION_REVIEW: empIssuancePreviewDocuments,
      EMP_ISSUANCE_APPLICATION_PEER_REVIEW: empIssuancePreviewDocuments,
      EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW: empIssuancePreviewDocuments,
      EMP_ISSUANCE_WAIT_FOR_AMENDS: empIssuancePreviewDocuments,
      EMP_VARIATION_APPLICATION_REVIEW: empVariationPreviewDocuments,
      EMP_VARIATION_APPLICATION_PEER_REVIEW: empVariationPreviewDocuments,
      EMP_VARIATION_WAIT_FOR_PEER_REVIEW: empVariationPreviewDocuments,
      EMP_VARIATION_WAIT_FOR_AMENDS: empVariationPreviewDocuments,
      EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT: empVariationRegulatorLedPreviewDocuments,
      EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW: empVariationRegulatorLedPreviewDocuments,
      EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW: empVariationRegulatorLedPreviewDocuments,
      EMP_NOTIFICATION_APPLICATION_REVIEW: empNotificationPreviewDocuments,
      EMP_NOTIFICATION_APPLICATION_PEER_REVIEW: empNotificationPreviewDocuments,
      EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW: empNotificationPreviewDocuments,
      DOE_APPLICATION_SUBMIT: doeSubmitPreviewDocuments,
      VIR_APPLICATION_REVIEW: virApplicationReviewPreviewDocuments,
    };
  });
