import { InjectionToken, Signal } from '@angular/core';

export type PreviewDocument = {
  filename: string;
  documentType: string;
  visibleInRelatedActions: boolean;
  visibleInNotify: boolean;
};
export type RelatedPreviewDocumentsMap = Signal<Record<string, PreviewDocument[]>>;

export const TASK_RELATED_PREVIEW_DOCUMENTS_MAP = new InjectionToken<RelatedPreviewDocumentsMap>(
  'Task related preview documents map',
);
