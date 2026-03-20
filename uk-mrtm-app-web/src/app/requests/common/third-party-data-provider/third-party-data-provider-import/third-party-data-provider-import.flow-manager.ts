import { Observable, of } from 'rxjs';

import { WizardFlowManager } from '@netz/common/forms';

import { IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK } from '@requests/common/third-party-data-provider/third-party-data-provider.const';

export class ThirdPartyDataProviderImportFlowManager extends WizardFlowManager {
  readonly subtask = IMPORT_THIRD_PARTY_DATA_PROVIDER_SUB_TASK;

  nextStepPath(): Observable<string> {
    return of('../../');
  }
}
