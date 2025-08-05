package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.Assert;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRequestQueryService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationRegulatorLedSubmitPreviewEmpDocumentServiceTest {

    @InjectMocks
    private EmpVariationRegulatorLedSubmitPreviewEmpDocumentService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpVariationRequestQueryService empVariationRequestQueryService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Mock
    private EmpPreviewCreateEmpDocumentService empPreviewCreateEmpDocumentService;

    @Mock
    private DateService dateService;

    @ParameterizedTest
    @MethodSource("regulatorReasonType")
    void createEmpForVariation_regulator_led(String summary, String expectedSummary) {
        final Long taskId = 100L;
        final Long accountId = 200L;
        final LocalDateTime creationDate = LocalDateTime.now().minusDays(2);
        final LocalDateTime submissionDate = LocalDateTime.now().minusDays(1);
        final LocalDateTime endDate = LocalDateTime.now();
        final String signatory = "signatory";
        final DecisionNotification decisionNotification = DecisionNotification.builder().signatory(signatory).build();
        EmpVariationRequestMetadata metadataCurrent = EmpVariationRequestMetadata
            .builder()
            .initiatorRoleType(RoleTypeConstants.REGULATOR)
            .build();
        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder()
                .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .metadata(metadataCurrent)
            .submissionDate(submissionDate)
            .creationDate(creationDate)
            .build();
        final Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename");
        final EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder().build();
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .reasonRegulatorLed(
                    EmpVariationRegulatorLedReason.builder()
                        .type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT)
                        .summary(summary)
                        .build()
                )
                .empAttachments(attachments)
                .build())
            .build();
        final int consolidationNumber = 2;
        final int newConsolidationNumber = consolidationNumber + 1;
        final String fileName = "fileName";
        final FileDTO fileDTO = FileDTO.builder().fileName(fileName).build();
        final List<EmpVariationRequestInfo> variationHistoricalRequests = List.of(mock(EmpVariationRequestInfo.class));
        EmpVariationRequestInfo variationCurrentRequest = EmpVariationRequestInfo.builder()
            .submissionDate(creationDate)
            .endDate(endDate)
            .metadata(
                EmpVariationRequestMetadata.builder()
                    .summary(expectedSummary)
                    .empConsolidationNumber(newConsolidationNumber)
                    .initiatorRoleType(RoleTypeConstants.REGULATOR)
                    .build())
            .build();
        final List<EmpVariationRequestInfo> variationHistory = new ArrayList<>(variationHistoricalRequests);
        variationHistory.add(variationCurrentRequest);

        final LocalDateTime empSubmissionDate = LocalDateTime.now();
        final LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(dateService.getLocalDateTime()).thenReturn(endDate);

        when(empVariationRequestQueryService.findEmpVariationRequests(accountId)).thenReturn(variationHistoricalRequests);
        when(emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId))
            .thenReturn(Request.builder().submissionDate(empSubmissionDate).endDate(empEndDate).build());
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId))
            .thenReturn(consolidationNumber);
        when(empPreviewCreateEmpDocumentService.getFile(decisionNotification, request, accountId, emp,
            attachments, variationHistory, newConsolidationNumber, empSubmissionDate, empEndDate)).thenReturn(fileDTO);

        final FileDTO result = service.create(taskId, decisionNotification);

        Assert.assertEquals(result.getFileName(), fileName);
        verify(emissionsMonitoringPlanQueryService).findApprovedByAccountId(accountId);
    }

    @Test
    void getType() {
        assertEquals(service.getTypes(), List.of(
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW
        ));
    }

    private static Stream<Arguments> regulatorReasonType() {
        return Stream.of(
            Arguments.of(null, ""),
            Arguments.of("", ""),
            Arguments.of("summary", "summary")
        );
    }
}