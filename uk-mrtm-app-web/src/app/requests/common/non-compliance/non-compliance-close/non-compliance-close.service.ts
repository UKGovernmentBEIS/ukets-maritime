import { inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { NonComplianceCloseApplicationRequestTaskActionPayload, TasksService } from '@mrtm/api';

import { requestTaskQuery, RequestTaskStore } from '@netz/common/store';

import { NonComplianceCloseFormGroupData } from '@requests/common/non-compliance/non-compliance-close/non-compliance-close.types';
import { createFileUploadPayload } from '@shared/utils';

@Injectable()
export class NonComplianceCloseService {
  private readonly store = inject(RequestTaskStore);
  private readonly service = inject(TasksService);

  close(formData: NonComplianceCloseFormGroupData): Observable<any> {
    return this.service.processRequestTaskAction({
      requestTaskId: this.store.select(requestTaskQuery.selectRequestTaskId)(),
      requestTaskActionType: 'NON_COMPLIANCE_CLOSE_APPLICATION',
      requestTaskActionPayload: this.createCloseTaskActionPayload(formData),
    });
  }

  private createCloseTaskActionPayload(
    formData: NonComplianceCloseFormGroupData,
  ): NonComplianceCloseApplicationRequestTaskActionPayload {
    return {
      payloadType: 'NON_COMPLIANCE_CLOSE_APPLICATION_PAYLOAD',
      reason: formData.reason,
      files: createFileUploadPayload(formData.files),
    };
  }
}
