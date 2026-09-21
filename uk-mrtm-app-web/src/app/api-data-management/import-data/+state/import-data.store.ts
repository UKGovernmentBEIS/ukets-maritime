import { Service } from '@angular/core';

import { SignalStore } from '@netz/common/store';

import { ImportDataState } from '@api-data-management/import-data/import-data.types';

@Service()
export class ImportDataStore extends SignalStore<ImportDataState> {
  constructor() {
    super({});
  }
}
