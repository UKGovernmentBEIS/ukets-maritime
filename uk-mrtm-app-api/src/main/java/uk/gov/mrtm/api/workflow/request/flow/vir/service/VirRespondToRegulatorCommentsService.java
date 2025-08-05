package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementFollowUpResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondedToRegulatorCommentsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveRespondToRegulatorCommentsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.mapper.VirMapper;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirRespondToRegulatorCommentsValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class VirRespondToRegulatorCommentsService {

    private final VirRespondToRegulatorCommentsValidator virRespondToRegulatorCommentsValidator;
    private final RequestService requestService;
    private final VirRespondToRegulatorCommentsNotificationService virRespondToRegulatorCommentsNotificationService;
    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Transactional
    public void applySaveAction(final VirSaveRespondToRegulatorCommentsRequestTaskActionPayload payload,
                                final RequestTask requestTask) {
        
        final VirApplicationRespondToRegulatorCommentsRequestTaskPayload taskPayload =
                (VirApplicationRespondToRegulatorCommentsRequestTaskPayload) requestTask.getPayload();

        // Validate reference
        virRespondToRegulatorCommentsValidator.validateReferenceOnRegulator(
            payload.getReference(),
            taskPayload.getRegulatorImprovementResponses()
        );

        // Update
        taskPayload.getOperatorImprovementFollowUpResponses().put(payload.getReference(), payload.getOperatorImprovementFollowUpResponse());
        taskPayload.setVirRespondToRegulatorCommentsSectionsCompleted(payload.getSectionsCompleted());
    }

    @Transactional
    public void applySubmitAction(final VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload payload,
                                  final RequestTask requestTask,
                                  final AppUser appUser) {

        final Request request = requestTask.getRequest();
        final VirApplicationRespondToRegulatorCommentsRequestTaskPayload taskPayload =
                (VirApplicationRespondToRegulatorCommentsRequestTaskPayload) requestTask.getPayload();
        final VirRequestPayload virRequestPayload = (VirRequestPayload) request.getPayload();
        final VirRequestMetadata virRequestMetadata = (VirRequestMetadata) request.getMetadata();

        // Validate reference
        virRespondToRegulatorCommentsValidator.validate(
            payload.getReference(),
            taskPayload.getOperatorImprovementFollowUpResponses(), 
            taskPayload.getRegulatorImprovementResponses()
        );

        // Remove reference
        final OperatorImprovementFollowUpResponse followUpResponse =
            taskPayload.getOperatorImprovementFollowUpResponses().remove(payload.getReference());
        taskPayload.getRegulatorImprovementResponses().remove(payload.getReference());
        taskPayload.setVirRespondToRegulatorCommentsSectionsCompleted(payload.getSectionsCompleted());

        // Add Request Action
        final VirApplicationRespondedToRegulatorCommentsRequestActionPayload actionPayload =
                VIR_MAPPER.toVirApplicationRespondedToRegulatorCommentsRequestActionPayload(
                        virRequestPayload, virRequestMetadata.getYear(), followUpResponse, payload.getReference(),
                        MrtmRequestActionPayloadType.VIR_APPLICATION_RESPONDED_TO_REGULATOR_COMMENTS_PAYLOAD
                );

        requestService.addActionToRequest(
                request,
                actionPayload,
                MrtmRequestActionType.VIR_APPLICATION_RESPONDED_TO_REGULATOR_COMMENTS,
                appUser.getUserId()
        );

        // Send notification email to Regulator
        virRespondToRegulatorCommentsNotificationService.sendSubmittedResponseToRegulatorCommentsNotificationToRegulator(request);
    }
}
