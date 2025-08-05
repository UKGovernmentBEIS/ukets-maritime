package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.mapper.VirMapper;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirSubmitValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class VirApplyService {

    private final RequestService requestService;
    private final VirSubmitValidator submitValidator;
    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Transactional
    public void applySubmitAction(final RequestTask requestTask, 
                                  final AppUser appUser) {
        
        final VirApplicationSubmitRequestTaskPayload taskPayload =
            (VirApplicationSubmitRequestTaskPayload) requestTask.getPayload();

        // Validate VIR
        submitValidator.validate(taskPayload.getOperatorImprovementResponses(), taskPayload.getVerificationData());

        // Submit VIR
        submitVir(requestTask, appUser);
    }

    @Transactional
    public void applySaveAction(final VirSaveApplicationRequestTaskActionPayload taskActionPayload,
                                final RequestTask requestTask) {

        final VirApplicationSubmitRequestTaskPayload taskPayload =
                (VirApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        taskPayload.setOperatorImprovementResponses(taskActionPayload.getOperatorImprovementResponses());
        taskPayload.setSectionsCompleted(taskActionPayload.getSectionsCompleted());
    }

    private void submitVir(final RequestTask requestTask, 
                           final AppUser appUser) {
        
        final Request request = requestTask.getRequest();
        final VirRequestPayload virRequestPayload = (VirRequestPayload) request.getPayload();
        final VirApplicationSubmitRequestTaskPayload
            taskPayload = (VirApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        final VirRequestMetadata virRequestMetadata = (VirRequestMetadata) request.getMetadata();

        // Update request
        virRequestPayload.setVirAttachments(taskPayload.getVirAttachments());
        virRequestPayload.setSectionsCompleted(taskPayload.getSectionsCompleted());
        virRequestPayload.setOperatorImprovementResponses(taskPayload.getOperatorImprovementResponses());

        // Add submitted action
        final VirApplicationSubmittedRequestActionPayload actionPayload = VIR_MAPPER
            .toVirApplicationSubmittedRequestActionPayload(taskPayload, virRequestMetadata.getYear(),
                    MrtmRequestActionPayloadType.VIR_APPLICATION_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(
            requestTask.getRequest(),
            actionPayload,
            MrtmRequestActionType.VIR_APPLICATION_SUBMITTED,
            appUser.getUserId());
    }
}
