import { Injectable } from '@angular/core';

import { produce } from 'immer';

import { SignalStore } from '@netz/common/store';

import {
  initialReturnToOperatorForChangesState,
  ReturnToOperatorForChangesState,
} from '@requests/tasks/aer-verification-submit/return-to-operator-for-changes/+state/return-to-operator-for-changes.state';

@Injectable({ providedIn: 'root' })
export class ReturnToOperatorForChangesStore extends SignalStore<ReturnToOperatorForChangesState> {
  constructor() {
    super(initialReturnToOperatorForChangesState);
  }

  setChangesRequired(changesRequired: string) {
    this.setState(
      produce(this.state, (state) => {
        state.changesRequired = changesRequired;
      }),
    );
  }

  setIsSubmitted(submitted: boolean) {
    this.setState(
      produce(this.state, (state) => {
        state.isSubmitted = submitted;
      }),
    );
  }
}
