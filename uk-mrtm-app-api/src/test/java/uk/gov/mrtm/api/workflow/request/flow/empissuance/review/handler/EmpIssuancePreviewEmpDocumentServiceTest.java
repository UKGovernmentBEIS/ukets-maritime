package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.handler.EmpPreviewCreateEmpDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuancePreviewEmpDocumentServiceTest {

    @InjectMocks
    private EmpIssuanceReviewPreviewEmpDocumentService service;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpPreviewCreateEmpDocumentService empPreviewCreateEmpDocumentService;

    @Mock
    private DateService dateService;

    @Test
    void create() {

        final long accountId = 2L;
        final long taskId = 2L;
        final LocalDateTime empSubmissionDate = LocalDateTime.now();
        final LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);
        final Request request = Request.builder()
            .submissionDate(empSubmissionDate).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        final EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder().build();
        final Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename");
        final RequestTask requestTask = RequestTask.builder()
            .id(taskId)
            .request(request)
            .payload(EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .empAttachments(attachments)
                .build())
            .build();
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(dateService.getLocalDateTime()).thenReturn(empEndDate);

        service.create(taskId, decisionNotification);

        verify(requestTaskService, times(1)).findTaskById(taskId);
        verify(empPreviewCreateEmpDocumentService, times(1)).getFile(
            decisionNotification, request, accountId, emp, attachments, Collections.emptyList(), 1,
            empSubmissionDate, empEndDate);
    }

    @Test
    void getTypes() {
        assertThat(service.getTypes())
            .containsExactlyElementsOf(List.of(
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_PEER_REVIEW,
                MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS
            ));
    }
}
