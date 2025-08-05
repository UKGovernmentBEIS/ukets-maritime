package uk.gov.mrtm.api.workflow.request.flow.empvariation.common;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.EmpVariationReviewPreviewEmpDocumentService;
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

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationPreviewEmpDocumentServiceTest {

    @InjectMocks
    private EmpVariationReviewPreviewEmpDocumentService service;

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

    @Test
    void createEmpForVariation_operator_led() {
        final Long taskId = 100L;
        final Long accountId = 200L;
        final LocalDateTime submissionDate = LocalDateTime.now().minusDays(1);
        final LocalDateTime endDate = LocalDateTime.now();
        final String signatory = "signatory";
        final DecisionNotification decisionNotification = DecisionNotification.builder().signatory(signatory).build();
        EmpVariationRequestMetadata metadataCurrent = EmpVariationRequestMetadata
            .builder()
            .initiatorRoleType(RoleTypeConstants.OPERATOR)
            .build();
        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder()
                .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .metadata(metadataCurrent)
            .submissionDate(submissionDate)
            .build();
        final Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename");
        final EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder().build();
        final String summary = "summary";
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(EmpVariationApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .determination(EmpVariationDetermination.builder().summary(summary).build())
                .empAttachments(attachments)
                .build())
            .build();
        final int consolidationNumber = 2;
        final int newConsolidationNumber = consolidationNumber + 1;
        final String fileName = "fileName";
        final FileDTO fileDTO = FileDTO.builder().fileName(fileName).build();
        final List<EmpVariationRequestInfo> variationHistoricalRequests = List.of(mock(EmpVariationRequestInfo.class));
        EmpVariationRequestInfo variationCurrentRequest = EmpVariationRequestInfo.builder()
            .submissionDate(submissionDate)
            .endDate(endDate)
            .metadata(
                EmpVariationRequestMetadata.builder()
                    .summary(summary)
                    .empConsolidationNumber(newConsolidationNumber)
                    .initiatorRoleType(RoleTypeConstants.OPERATOR)
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

        assertEquals(result.getFileName(), fileName);
        verify(emissionsMonitoringPlanQueryService).findApprovedByAccountId(accountId);
    }
}