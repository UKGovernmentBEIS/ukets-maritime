import { Injectable } from '@angular/core';

import { ConfigState, initialState } from '@core/config/config.state';
import { Store } from '@core/store';

@Injectable({ providedIn: 'root' })
export class ConfigStore extends Store<ConfigState> {
  constructor() {
    super(initialState);
  }
}
