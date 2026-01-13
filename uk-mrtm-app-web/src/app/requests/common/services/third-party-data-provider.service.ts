import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { RequestTaskPayload } from '@mrtm/api';

import { TaskService } from '@netz/common/forms';

export interface IThirdPartyDataProviderService<T extends RequestTaskPayload> extends TaskService<T> {
  importThirdPartyData<TInput = any>(
    subtask: string,
    step: string,
    route: ActivatedRoute,
    userInput: TInput,
  ): Observable<string>;
}
