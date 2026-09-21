import { computed, inject, Signal } from '@angular/core';

import { DecisionNotification } from '@mrtm/api';

import { PreviewDocument, TASK_RELATED_PREVIEW_DOCUMENTS_MAP } from '@netz/common/components';
import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { AttachedFile } from '@shared/types';

/**
 * RFI/RDE sub-flows share the parent task's type, so their preview documents are looked up by the
 * allowed request task action of the flow (e.g. RFI_SAVE) rather than by the request task type.
 * Must be called in an injection context.
 */
export function injectRequestPreviewDocuments(action: string): Signal<PreviewDocument[]> {
  const taskStore = inject(RequestTaskStore);
  const relatedPreviewDocumentsMap = inject(TASK_RELATED_PREVIEW_DOCUMENTS_MAP, { optional: true });

  return computed(() => {
    const allowedActions = taskStore.select(requestTaskQuery.selectAllowedRequestTaskActions)() ?? [];

    if (!action || !allowedActions.includes(action)) {
      return [];
    }

    return (relatedPreviewDocumentsMap?.()?.[action] ?? []).filter((document) => document.visibleInNotify);
  });
}

/**
 * Builds the download link of the document preview of an official notice, mirroring the link of
 * `netz-related-documents`, so that it can be rendered by `mrtm-summary-download-files` (e.g. in a summary list).
 */
export function toOfficialNoticeFile(
  document: PreviewDocument,
  decisionNotification: DecisionNotification,
  fileDownloadPrePath: string[] = [],
): AttachedFile {
  return {
    fileName: document.filename,
    downloadUrl: [...fileDownloadPrePath, 'file-download', 'document-preview', document.documentType].join('/'),
    queryParams: {
      filename: document.filename,
      signatory: decisionNotification.signatory,
      operators: decisionNotification.operators ?? [],
      externalContacts: decisionNotification.externalContacts ?? [],
    },
  };
}
