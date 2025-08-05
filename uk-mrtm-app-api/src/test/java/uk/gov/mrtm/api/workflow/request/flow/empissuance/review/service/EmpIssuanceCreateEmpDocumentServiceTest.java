package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceCreateEmpDocumentServiceTest {

    @InjectMocks
    private EmpIssuanceCreateEmpDocumentService cut;

    @Mock
    private RequestService requestService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Mock
    private EmpCreateDocumentService empCreateDocumentService;

    @Mock
    private DateService dateService;

    @Test
    void create() {

        final String requestId = "1";
        final long accountId = 5L;
        final String signatory = "signatory";
        final LocalDateTime empSubmissionDate = LocalDateTime.now();
        final LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);
        final EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .decisionNotification(DecisionNotification.builder()
                        .signatory(signatory)
                        .build())
                .build();
        final Request request =
                Request.builder()
                    .submissionDate(empSubmissionDate)
                    .requestResources(List.of(RequestResource.builder()
                    .resourceId(String.valueOf(accountId))
                    .resourceType(ResourceType.ACCOUNT).build())).payload(requestPayload).build();
        final EmissionsMonitoringPlanDTO empDto =
                EmissionsMonitoringPlanDTO.builder().id("empId").build();
        final FileInfoDTO empDocument = FileInfoDTO.builder().uuid("uuid").build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(dateService.getLocalDateTime()).thenReturn(empEndDate);
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
                .thenReturn(Optional.of(empDto));
        when(empCreateDocumentService.generateDocumentAsync(request, signatory, empDto,
            MrtmDocumentTemplateType.EMP, new ArrayList<>(), empSubmissionDate, empEndDate))
                .thenReturn(CompletableFuture.completedFuture(empDocument));

        cut.create(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(empCreateDocumentService, times(1)).generateDocumentAsync(request, signatory, empDto,
            MrtmDocumentTemplateType.EMP, new ArrayList<>(), empSubmissionDate, empEndDate);
    }
}
