package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceAmendDetailsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCloseJustification;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDetailsAmendedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceDetailsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestTaskClosable;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class NonComplianceApplyService {

    private final RequestService requestService;

    public void applySaveAction(final RequestTask requestTask,
                                final NonComplianceSaveApplicationRequestTaskActionPayload taskActionPayload) {
        
        final NonComplianceApplicationSubmitRequestTaskPayload
            requestTaskPayload = (NonComplianceApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        
        requestTaskPayload.setReason(taskActionPayload.getReason());
        requestTaskPayload.setNonComplianceDate(taskActionPayload.getNonComplianceDate());
        requestTaskPayload.setComplianceDate(taskActionPayload.getComplianceDate());
        requestTaskPayload.setNonComplianceComments(taskActionPayload.getNonComplianceComments());
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

    public void amendDetails(final RequestTask requestTask,
                             final NonComplianceAmendDetailsRequestTaskActionPayload taskActionPayload,
                             final AppUser appUser) {

        final NonComplianceDetailsRequestTaskPayload
            requestTaskPayload = (NonComplianceDetailsRequestTaskPayload) requestTask.getPayload();


        requestTaskPayload.setReason(taskActionPayload.getReason());
        requestTaskPayload.setComplianceDate(taskActionPayload.getComplianceDate());
        requestTaskPayload.setNonComplianceDate(taskActionPayload.getNonComplianceDate());
        requestTaskPayload.setNonComplianceComments(taskActionPayload.getNonComplianceComments());

        NonComplianceDetailsAmendedRequestActionPayload actionPayload =
            NonComplianceDetailsAmendedRequestActionPayload
                .builder()
                .reason(taskActionPayload.getReason())
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_DETAILS_AMENDED_PAYLOAD)
                .complianceDate(taskActionPayload.getComplianceDate())
                .nonComplianceDate(taskActionPayload.getNonComplianceDate())
                .nonComplianceComments(taskActionPayload.getNonComplianceComments())
                .build();

        requestService.addActionToRequest(
            requestTask.getRequest(),
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_DETAILS_AMENDED,
            appUser.getUserId()
        );
    }


    public void submitDetails(Request request, NonComplianceDetailsRequestTaskPayload taskPayload) {
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();

        requestPayload.setReason(taskPayload.getReason());
        requestPayload.setNonComplianceDate(taskPayload.getNonComplianceDate());
        requestPayload.setComplianceDate(taskPayload.getComplianceDate());
        requestPayload.setNonComplianceComments(taskPayload.getNonComplianceComments());
    }
}
