import { Injectable } from '@angular/core';

import { SignalStore } from '@netz/common/store';

import { WorkflowState } from '@requests/workflows/workflows.types';

@Injectable({ providedIn: 'root' })
export class WorkflowStore extends SignalStore<WorkflowState> {
  constructor() {
    super({});
  }
}
