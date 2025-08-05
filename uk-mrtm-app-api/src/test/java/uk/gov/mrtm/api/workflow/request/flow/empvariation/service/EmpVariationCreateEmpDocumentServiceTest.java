package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationCreateEmpDocumentServiceTest {

    @InjectMocks
    private EmpVariationCreateEmpDocumentService empVariationCreateEmpDocumentService;

    @Mock
    private RequestService requestService;

    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

    @Mock
    private EmpCreateDocumentService empCreateDocumentService;

    @Mock
    private DateService dateService;

    @Mock
    private EmpVariationRequestQueryService empVariationRequestQueryService;

    @ParameterizedTest
    @MethodSource("testCases")
    void create(String roleType) throws InterruptedException, ExecutionException {
        final String requestId = "1";
        final long accountId = 5L;
        final LocalDateTime variationSubmissionDate = LocalDateTime.now();
        final LocalDateTime variationCreationDate = variationSubmissionDate.minusDays(1);
        final LocalDateTime variationEndDate = variationSubmissionDate.plusDays(1);
        final LocalDateTime empSubmissionDate = LocalDateTime.now();
        final LocalDateTime empEndDate = LocalDateTime.now().plusDays(1);
        EmpVariationRequestMetadata metadata = EmpVariationRequestMetadata
            .builder()
            .initiatorRoleType(RoleTypeConstants.OPERATOR)
            .build();
        EmpVariationRequestMetadata metadataCurrent = EmpVariationRequestMetadata
            .builder()
            .initiatorRoleType(roleType)
            .build();
        final EmpVariationRequestInfo empVariationRequestInfo = EmpVariationRequestInfo
            .builder()
            .metadata(metadata)
            .build();
        final String signatory = "signatory";
        final EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .decisionNotification(DecisionNotification.builder()
                        .signatory(signatory)
                        .build())
                .build();
        EmpVariationRequestInfo variationCurrentRequest = EmpVariationRequestInfo.builder()
            .metadata(metadataCurrent)
            .submissionDate(variationCreationDate)
            .endDate(variationEndDate).build();
        final Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .creationDate(variationCreationDate)
            .submissionDate(variationCreationDate)
            .metadata(metadataCurrent)
            .type(RequestType.builder().code(MrtmRequestType.EMP_VARIATION).build())
            .build();
        final EmissionsMonitoringPlanDTO empDto =
                EmissionsMonitoringPlanDTO.builder().id("empId").build();
        final FileInfoDTO empDocument = FileInfoDTO.builder().uuid("uuid").build();


        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(dateService.getLocalDateTime()).thenReturn(variationEndDate);
        when(empVariationRequestQueryService.findEmpVariationRequests(accountId))
            .thenReturn(List.of(empVariationRequestInfo));
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
                .thenReturn(Optional.of(empDto));
        when(empCreateDocumentService.generateDocumentAsync(request, signatory, empDto, MrtmDocumentTemplateType.EMP,
            List.of(empVariationRequestInfo, variationCurrentRequest), empSubmissionDate, empEndDate))
            .thenReturn(CompletableFuture.completedFuture(empDocument));
        when(emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId))
            .thenReturn(Request.builder().submissionDate(empSubmissionDate).endDate(empEndDate).build());

        CompletableFuture<FileInfoDTO> result = empVariationCreateEmpDocumentService.create(requestId);

        assertThat(result.get()).isEqualTo(empDocument);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(empCreateDocumentService, times(1)).generateDocumentAsync(request, signatory, empDto,
            MrtmDocumentTemplateType.EMP, List.of(empVariationRequestInfo, variationCurrentRequest), empSubmissionDate,
                empEndDate);
        verify(emissionsMonitoringPlanQueryService).findApprovedByAccountId(accountId);
    }


    private static Stream<Arguments> testCases() {

        return Stream.of(
            Arguments.of(RoleTypeConstants.OPERATOR),
            Arguments.of(RoleTypeConstants.REGULATOR)
        );
    }

}
