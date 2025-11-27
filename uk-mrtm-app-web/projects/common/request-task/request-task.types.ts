import { Type } from '@angular/core';

import { TaskSection } from '@netz/common/model';

type RequestTaskPageContent = {
  pageTopComponent?: Type<unknown>;
  contentComponent?: Type<unknown>;
  postHeaderComponent?: Type<unknown>;
  preContentComponent?: Type<unknown>;
  postContentComponent?: Type<unknown>;
  header: string;
  headerSize?: 'l' | 'xl';
  sections?: TaskSection[];
};

export type RequestTaskPageContentFactory = () => RequestTaskPageContent;
export type RequestTaskPageContentFactoryMap = Record<string, RequestTaskPageContentFactory>;
export type RequestTaskIsEditableResolver = () => boolean;
