import { Injectable } from '@angular/core';

import { SignalStore } from '@netz/common/store';

import { BatchVariationState } from '@batch-variations/batch-variations.types';

@Injectable({ providedIn: 'root' })
export class BatchVariationStore extends SignalStore<BatchVariationState> {
  constructor() {
    super({});
  }
}
