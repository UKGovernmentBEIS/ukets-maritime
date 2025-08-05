package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestTaskClosable;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

@Service
@RequiredArgsConstructor
public class NonComplianceApplyService {

    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceSaveApplicationRequestTaskActionPayload taskActionPayload) {
        
        final NonComplianceApplicationSubmitRequestTaskPayload
            requestTaskPayload = (NonComplianceApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        
        requestTaskPayload.setReason(taskActionPayload.getReason());
        requestTaskPayload.setNonComplianceDate(taskActionPayload.getNonComplianceDate());
        requestTaskPayload.setComplianceDate(taskActionPayload.getComplianceDate());
        requestTaskPayload.setComments(taskActionPayload.getComments());
        requestTaskPayload.setSelectedRequests(taskActionPayload.getSelectedRequests());
        requestTaskPayload.setNonCompliancePenalties(taskActionPayload.getNonCompliancePenalties());
        requestTaskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    public void applyCloseAction(final RequestTask requestTask,
                                 final NonComplianceCloseApplicationRequestTaskActionPayload taskActionPayload) {

        final NonComplianceCloseJustification closeJustification = taskActionPayload.getCloseJustification();

        final NonComplianceRequestTaskClosable
            requestTaskPayload = (NonComplianceRequestTaskClosable) requestTask.getPayload();
        requestTaskPayload.setCloseJustification(closeJustification);

        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) requestTask.getRequest().getPayload();
        requestPayload.setCloseJustification(closeJustification);
        requestPayload.setNonComplianceAttachments(requestTaskPayload.getNonComplianceAttachments());
    }
}
