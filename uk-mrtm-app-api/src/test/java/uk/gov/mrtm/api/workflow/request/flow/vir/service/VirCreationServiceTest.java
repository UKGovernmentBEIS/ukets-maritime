package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirVerificationData;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirCreationValidator;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirCreationServiceTest {

    @InjectMocks
    private VirCreationService virCreationService;

    @Mock
    private RequestService requestService;

    @Mock
    private VirDueDateService virDueDateService;

    @Mock
    private VirCreationValidator virCreationValidator;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Test
    void createRequestVir() {

        final String requestId = "AEM-1";
        final Long accountId = 1L;
        final Year year = Year.of(2022);
        final Date dueDate = new Date();
        final UncorrectedItem uncorrectedItem = UncorrectedItem.builder()
                .explanation("Explanation")
                .reference("A1")
                .materialEffect(true)
                .build();
        final Map<String, UncorrectedItem> uncorrectedItems = Map.of("A1", uncorrectedItem);
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .verificationReport(AerVerificationReport.builder()
                        .verificationData(AerVerificationData.builder()
//                                .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
//                                        .uncorrectedNonConformities(Set.of(uncorrectedItem))
//                                        .build())
                                .build())
                        .build())
                .build();

        final Request aerRequest = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .metadata(AerRequestMetadata.builder().year(year).build())
                .payload(aerRequestPayload)
                .creationDate(LocalDateTime.of(2023, 5, 14, 5, 40))
                .build();

        final VirVerificationData virVerificationData = VirVerificationData.builder()
//                .uncorrectedNonConformities(uncorrectedItems)
                .build();

        final RequestCreateValidationResult validationResult =
                RequestCreateValidationResult.builder().valid(true).build();
        final VirRequestPayload virRequestPayload = VirRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                .verificationData(virVerificationData)
                .build();

        final RequestParams params = RequestParams.builder()
                .type(MrtmRequestType.VIR)
                .requestPayload(virRequestPayload)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestMetadata(VirRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.VIR)
                        .year(year)
                        .relatedAerRequestId(requestId)
                        .build())
                .processVars(Map.of(MrtmBpmnProcessConstants.VIR_EXPIRATION_DATE, dueDate))
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(aerRequest);
        // TODO Un-comment when The verification subtasks are implemented
        when(virCreationValidator.validate(virVerificationData, accountId, year)).thenReturn(validationResult);
        when(virDueDateService.generateDueDate(Year.of(2023))).thenReturn(dueDate);

        // Invoke
        virCreationService.createRequestVir(requestId, accountId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(virCreationValidator, times(1)).validate(virVerificationData, accountId, year);
        verify(virDueDateService, times(1)).generateDueDate(Year.of(2023));
        verify(startProcessRequestService, times(1)).startProcess(params);
    }

    @Test
    void createRequestVir_not_allowed() {

        final String requestId = "AEM-1";
        final Long accountId = 1L;
        final Year year = Year.of(2022);
        final UncorrectedItem uncorrectedItem = UncorrectedItem.builder()
                .explanation("Explanation")
                .reference("A1")
                .materialEffect(true)
                .build();
        final Map<String, UncorrectedItem> uncorrectedItems = Map.of("A1", uncorrectedItem);
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.AER_REQUEST_PAYLOAD)
                .verificationReport(AerVerificationReport.builder()
                        .verificationData(AerVerificationData.builder()
                                // TODO Un-comment when The verification subtasks are implemented
//                                .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
//                                        .uncorrectedNonConformities(Set.of(uncorrectedItem))
//                                        .build())
                                .build())
                        .build())
                .build();

        final Request aerRequest = Request.builder()
                .id(requestId)
                .requestResources(List.of(RequestResource.builder()
                        .resourceType(ResourceType.ACCOUNT)
                        .resourceId(String.valueOf(accountId))
                        .build()))
                .metadata(AerRequestMetadata.builder().year(year).build())
                .payload(aerRequestPayload)
                .build();


        final VirVerificationData virVerificationData = VirVerificationData.builder()
//                .uncorrectedNonConformities(uncorrectedItems)
                .build();

        final RequestCreateValidationResult validationResult =
                RequestCreateValidationResult.builder().valid(false).build();

        when(requestService.findRequestById(requestId)).thenReturn(aerRequest);
        when(virCreationValidator.validate(virVerificationData, accountId, year)).thenReturn(validationResult);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class, () ->
                virCreationService.createRequestVir(requestId, accountId));

        // Verify
        assertThat(businessException.getErrorCode()).isEqualTo(MrtmErrorCode.VIR_CREATION_NOT_ALLOWED);
        verify(requestService, times(1)).findRequestById(requestId);
        verify(virCreationValidator, times(1)).validate(virVerificationData, accountId, year);
        verify(virDueDateService, never()).generateDueDate(any());
        verify(startProcessRequestService, never()).startProcess(any());
    }
}
