package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerSaveApplicationVerificationRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
public class RequestAerApplyVerificationService {

    @Transactional
    public void applySaveAction(AerSaveApplicationVerificationRequestTaskActionPayload taskActionPayload,
                                RequestTask requestTask) {

        Request request = requestTask.getRequest();

        AerRequestPayload aerRequestPayload = ((AerRequestPayload) request.getPayload());

        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
                (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();

        taskPayload.getVerificationReport().setVerificationData(taskActionPayload.getVerificationData());
        taskPayload.setVerificationSectionsCompleted(taskActionPayload.getVerificationSectionsCompleted());


        aerRequestPayload.setVerificationReport(taskPayload.getVerificationReport());
        aerRequestPayload.getVerificationReport().setVerificationBodyId(request.getVerificationBodyId());
        aerRequestPayload.setVerificationSectionsCompleted(taskActionPayload.getVerificationSectionsCompleted());
    }
}
