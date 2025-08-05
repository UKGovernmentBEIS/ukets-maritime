import { Type } from '@angular/core';

export interface TaskSuperSection {
  superTitle: string;
  sections: TaskSection[];
}

export interface TaskSection {
  title?: string;
  tasks: TaskItem[];
}
export interface TaskItem {
  name?: string;
  status: string;
  linkText: string;
  link: string;
  warningHint?: string;
  hint?: string;
  postContentComponent?: Type<unknown>;
  data?: Record<string, unknown>;
}
