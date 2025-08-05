package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateUtils;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CalculateRespondToRegulatorCommentsExpirationDateServiceTest {

    @InjectMocks
    private CalculateRespondToRegulatorCommentsExpirationDateService
        calculateRespondToRegulatorCommentsExpirationDateService;

    @Mock
    private RequestService requestService;

    @Test
    void calculateExpirationDate() {
        final String requestId = "AEM-001";
        final LocalDate currentDate = LocalDate.now();
        final Date expected = DateUtils.atEndOfDay(currentDate.minusDays(10));
        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.VIR).build())
                .requestResources(List.of(RequestResource.builder()
                        .resourceId("1")
                        .resourceType(ResourceType.ACCOUNT)
                        .build()))
                .id(requestId)
                .requestTasks(List.of(
                        RequestTask.builder()
                                .type(RequestTaskType.builder().code(MrtmRequestTaskType.VIR_RESPOND_TO_REGULATOR_COMMENTS).build())
                                .payload(VirApplicationRespondToRegulatorCommentsRequestTaskPayload.builder()
                                        .payloadType(MrtmRequestTaskPayloadType.VIR_RESPOND_TO_REGULATOR_COMMENTS_PAYLOAD)
                                        .regulatorImprovementResponses(Map.of(
                                                "A1", RegulatorImprovementResponse.builder()
                                                        .improvementRequired(false).build(),
                                                "A2", RegulatorImprovementResponse.builder().improvementRequired(true)
                                                        .improvementDeadline(currentDate).build(),
                                                "A3", RegulatorImprovementResponse.builder().improvementRequired(true)
                                                        .improvementDeadline(currentDate.minusDays(10)).build()
                                        )).build())
                                .build()
                )).build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        Date actual = calculateRespondToRegulatorCommentsExpirationDateService.calculateExpirationDate(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void calculateExpirationDate_no_improvements() {
        final String requestId = "AEM-001";
        final Request request = Request.builder()
                .id(requestId)
                .payload(VirRequestPayload.builder()
                        .regulatorReviewResponse(RegulatorReviewResponse.builder()
                                .regulatorImprovementResponses(Map.of(
                                        "A1", RegulatorImprovementResponse.builder().improvementRequired(false).build(),
                                        "A2", RegulatorImprovementResponse.builder().improvementRequired(false).build()
                                ))
                                .build())
                        .build())
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        BusinessException be = assertThrows(BusinessException.class,
                () -> calculateRespondToRegulatorCommentsExpirationDateService.calculateExpirationDate(requestId));

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);
    }
}
