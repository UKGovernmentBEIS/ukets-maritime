package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.OperatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSaveApplicationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirSubmitValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.Year;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class VirApplyServiceTest {

    @InjectMocks
    private VirApplyService requestVirApplyService;

    @Mock
    private RequestService requestService;

    @Mock
    private VirSubmitValidator virSubmitValidator;

    @Test
    void applySaveAction() {

        final Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of("A1",
                OperatorImprovementResponse.builder().isAddressed(false).addressedDescription("description").build()
        );
        final VirSaveApplicationRequestTaskActionPayload virApplySavePayload =
            VirSaveApplicationRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.VIR_SAVE_APPLICATION_PAYLOAD)
                        .operatorImprovementResponses(operatorImprovementResponses)
                        .build();
        final RequestTask requestTask = RequestTask.builder()
                .payload(VirApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.VIR_APPLICATION_SUBMIT_PAYLOAD)
                        .operatorImprovementResponses(Map.of("A2",
                                OperatorImprovementResponse.builder().isAddressed(false).addressedDescription("description").build()
                        ))
                        .build())
                .build();

        // Invoke
        requestVirApplyService.applySaveAction(virApplySavePayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(VirApplicationSubmitRequestTaskPayload.class);

        VirApplicationSubmitRequestTaskPayload payloadSaved = (VirApplicationSubmitRequestTaskPayload) requestTask.getPayload();
        assertThat(payloadSaved.getOperatorImprovementResponses()).isEqualTo(operatorImprovementResponses);
    }

    @Test
    void submitVir() {
        
        final String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();
        final  Map<String, OperatorImprovementResponse> operatorImprovementResponses = Map.of(
                "A1", OperatorImprovementResponse.builder().build());
        final VirVerificationData verificationData = VirVerificationData.builder()
                .uncorrectedNonConformities(Map.of("A1", UncorrectedItem.builder().build()))
                .build();
        final Map<String, String> sectionsCompleted = Map.of("A1", "true");
        final Year reportingYear = Year.now();

        final Request request = Request.builder()
                .metadata(VirRequestMetadata.builder()
                        .year(reportingYear)
                        .build())
                .payload(VirRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                        .build())
                .build();

        final RequestTask requestTask = RequestTask.builder()
                .payload(VirApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.VIR_APPLICATION_SUBMIT_PAYLOAD)
                        .verificationData(verificationData)
                        .operatorImprovementResponses(operatorImprovementResponses)
                        .sectionsCompleted(sectionsCompleted)
                        .build())
                .request(request)
                .build();

        final VirApplicationSubmittedRequestActionPayload actionPayload = VirApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.VIR_APPLICATION_SUBMITTED_PAYLOAD)
                .reportingYear(reportingYear)
                .verificationData(verificationData)
                .operatorImprovementResponses(operatorImprovementResponses)
                .build();

        // Invoke
        requestVirApplyService.applySubmitAction(requestTask, appUser);

        // Verify
        verify(virSubmitValidator, times(1)).validate(operatorImprovementResponses, verificationData);

        assertThat(request.getPayload()).isInstanceOf(VirRequestPayload.class);

        final VirRequestPayload payloadSaved = (VirRequestPayload) request.getPayload();
        assertThat(payloadSaved.getOperatorImprovementResponses()).isEqualTo(operatorImprovementResponses);
        assertThat(payloadSaved.getSectionsCompleted()).isEqualTo(sectionsCompleted);

        verify(requestService, times(1))
                .addActionToRequest(request, actionPayload, MrtmRequestActionType.VIR_APPLICATION_SUBMITTED, userId);
    }
}
