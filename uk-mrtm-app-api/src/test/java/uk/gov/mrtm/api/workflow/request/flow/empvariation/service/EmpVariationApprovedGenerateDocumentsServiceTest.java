package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationApprovedGenerateDocumentsServiceTest {

    @InjectMocks
    private EmpVariationApprovedGenerateDocumentsService empVariationApprovedGenerateDocumentsService;

    @Mock
    private RequestService requestService;

    @Mock
    private EmpVariationCreateEmpDocumentService empVariationCreateEmpDocumentService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Mock
    private EmissionsMonitoringPlanService emissionsMonitoringPlanService;

    @Mock
    private EmpVariationOfficialNoticeService empVariationOfficialNoticeService;

    @Test
    void generateDocuments() {
        final String requestId = "1";
        final Long accountId = 5L;
        final String signatory = "signatory";

        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .decisionNotification(DecisionNotification.builder()
                        .signatory(signatory)
                        .build())
                .build();

        final Request request = Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .payload(requestPayload)
                .build();

        UUID empUuid = UUID.randomUUID();
        FileInfoDTO empDocument = FileInfoDTO.builder()
                .name("emp.pdf")
                .uuid(empUuid.toString())
                .build();

        UUID officialNoticeUuid = UUID.randomUUID();
        FileInfoDTO officialNotice = FileInfoDTO.builder()
                .name("official notice.pdf")
                .uuid(officialNoticeUuid.toString())
                .build();

        final EmissionsMonitoringPlanDTO empDto =
                EmissionsMonitoringPlanDTO.builder()
                        .id("empId")
                        .consolidationNumber(5)
                        .accountId(accountId)
                        .build();

        when(empVariationCreateEmpDocumentService.create(requestId))
                .thenReturn(CompletableFuture.completedFuture(empDocument));
        when(empVariationOfficialNoticeService.generateApprovedOfficialNotice(requestId))
                .thenReturn(CompletableFuture.completedFuture(officialNotice));
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
                .thenReturn(Optional.of(empDto));

        empVariationApprovedGenerateDocumentsService.generateDocuments(requestId, false);

        verify(empVariationCreateEmpDocumentService, times(1)).create(requestId);
        verify(empVariationOfficialNoticeService, times(1)).generateApprovedOfficialNotice(requestId);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(emissionsMonitoringPlanService, times(1)).setFileDocumentUuid(empDto.getId(), empUuid.toString());

        assertThat(requestPayload.getEmpDocument()).isEqualTo(empDocument);
        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialNotice);
    }


    @Test
    void generateDocuments_regulator_led() {
        final String requestId = "1";
        final Long accountId = 5L;
        final String signatory = "signatory";

        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
            .decisionNotification(DecisionNotification.builder()
                .signatory(signatory)
                .build())
            .build();

        final Request request = Request.builder()
            .type(RequestType.builder().code(MrtmRequestType.EMP_VARIATION).build())
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .build();

        UUID empUuid = UUID.randomUUID();
        FileInfoDTO empDocument = FileInfoDTO.builder()
            .name("emp.pdf")
            .uuid(empUuid.toString())
            .build();

        UUID officialNoticeUuid = UUID.randomUUID();
        FileInfoDTO officialNotice = FileInfoDTO.builder()
            .name("official notice.pdf")
            .uuid(officialNoticeUuid.toString())
            .build();

        final EmissionsMonitoringPlanDTO empDto =
            EmissionsMonitoringPlanDTO.builder()
                .id("empId")
                .consolidationNumber(5)
                .accountId(accountId)
                .build();

        when(empVariationCreateEmpDocumentService.create(requestId))
            .thenReturn(CompletableFuture.completedFuture(empDocument));
        when(empVariationOfficialNoticeService.generateApprovedOfficialNoticeRegulatorLed(requestId))
            .thenReturn(CompletableFuture.completedFuture(officialNotice));
        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
            .thenReturn(Optional.of(empDto));

        empVariationApprovedGenerateDocumentsService.generateDocuments(requestId, true);

        verify(empVariationCreateEmpDocumentService, times(1)).create(requestId);
        verify(empVariationOfficialNoticeService, times(1)).generateApprovedOfficialNoticeRegulatorLed(requestId);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(emissionsMonitoringPlanService, times(1)).setFileDocumentUuid(empDto.getId(), empUuid.toString());

        assertThat(requestPayload.getEmpDocument()).isEqualTo(empDocument);
        assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialNotice);
    }

    @Test
    void generateDocuments_throws_business_exception() {
        final String requestId = "1";
        final String signatory = "signatory";

        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
            .decisionNotification(DecisionNotification.builder()
                .signatory(signatory)
                .build())
            .build();

        UUID officialNoticeUuid = UUID.randomUUID();
        FileInfoDTO officialNotice = FileInfoDTO.builder()
            .name("official notice.pdf")
            .uuid(officialNoticeUuid.toString())
            .build();

        when(empVariationCreateEmpDocumentService.create(requestId)).thenAnswer(answer -> {
            CompletableFuture<?> future = new CompletableFuture<>();
            future.completeExceptionally(new BusinessException(ErrorCode.DOCUMENT_TEMPLATE_FILE_GENERATION_ERROR, "emp.pdf"));
            return future;
        });

        when(empVariationOfficialNoticeService.generateApprovedOfficialNotice(requestId))
            .thenReturn(CompletableFuture.completedFuture(officialNotice));

        BusinessException be = assertThrows(BusinessException.class, () ->
            empVariationApprovedGenerateDocumentsService.generateDocuments(requestId, false));
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.DOCUMENT_TEMPLATE_FILE_GENERATION_ERROR);

        verify(empVariationCreateEmpDocumentService, times(1)).create(requestId);
        verify(empVariationOfficialNoticeService, times(1)).generateApprovedOfficialNotice(requestId);
        verifyNoInteractions(requestService, emissionsMonitoringPlanQueryService, emissionsMonitoringPlanService);

        assertThat(requestPayload.getEmpDocument()).isNull();
        assertThat(requestPayload.getOfficialNotice()).isNull();
    }

    @Test
    void generateDocuments_throws_internal_server_error_exception() {
        final String requestId = "1";
        final String signatory = "signatory";

        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
            .decisionNotification(DecisionNotification.builder()
                .signatory(signatory)
                .build())
            .build();

        UUID officialNoticeUuid = UUID.randomUUID();
        FileInfoDTO officialNotice = FileInfoDTO.builder()
            .name("official notice.pdf")
            .uuid(officialNoticeUuid.toString())
            .build();

        when(empVariationCreateEmpDocumentService.create(requestId)).thenAnswer(answer -> {
            CompletableFuture<?> future = new CompletableFuture<>();
            future.completeExceptionally(new RuntimeException("interrupted exception"));
            return future;
        });

        when(empVariationOfficialNoticeService.generateApprovedOfficialNotice(requestId))
            .thenReturn(CompletableFuture.completedFuture(officialNotice));

        BusinessException be = assertThrows(BusinessException.class, () -> empVariationApprovedGenerateDocumentsService.
            generateDocuments(requestId, false));
        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INTERNAL_SERVER);

        verify(empVariationCreateEmpDocumentService, times(1)).create(requestId);
        verify(empVariationOfficialNoticeService, times(1)).generateApprovedOfficialNotice(requestId);
        verifyNoInteractions(requestService, emissionsMonitoringPlanQueryService, emissionsMonitoringPlanService);

        assertThat(requestPayload.getEmpDocument()).isNull();
        assertThat(requestPayload.getOfficialNotice()).isNull();
    }
}
