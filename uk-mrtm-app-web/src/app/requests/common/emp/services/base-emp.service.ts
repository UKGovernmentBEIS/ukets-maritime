import { concatMap, Observable, tap } from 'rxjs';

import { TaskService } from '@netz/common/forms';

export abstract class BaseEmpService<T> extends TaskService<T> {
  saveShipsXml(subtask: string, step: string, userInput: any): Observable<string> {
    return this.payloadMutators.mutate(subtask, step, this.payload, userInput).pipe(
      concatMap((payload) => this.sideEffects.apply(subtask, step, payload, 'SAVE_SUBTASK')),
      concatMap((payload) => this.apiService.save(payload)),
      tap((payload) => (this.payload = payload)),
    );
  }
}
