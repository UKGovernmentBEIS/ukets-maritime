package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.mrtm.api.reporting.domain.verification.AerRecommendedImprovements;
import uk.gov.mrtm.api.reporting.domain.verification.AerUncorrectedNonConformities;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.service.AerService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirCreationService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.time.Year;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCreateVirServiceTest {

    @InjectMocks
    private AerCreateVirService aerCreateVirService;

    @Mock
    private RequestService requestService;

    @Mock
    private VirCreationService virCreationService;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private AerService aerService;

    @Test
    void createRequestVir() {
        
        final long accountId = 1L;
        final String requestId = "AEM-1";
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .virTriggered(false)
            .verificationPerformed(true)
            .verificationReport(AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                    .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                        .uncorrectedNonConformities(Set.of(UncorrectedItem.builder().build()))
                        .priorYearIssues(Set.of(VerifierComment.builder().build()))
                        .build())
                    .recommendedImprovements(AerRecommendedImprovements.builder()
                        .exist(true)
                        .recommendedImprovements(Set.of(VerifierComment.builder().build()))
                        .build())
                    .build())
                .build())
            .build();
        
        final Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                            .resourceId(String.valueOf(accountId))
                    .build()))
            .payload(aerRequestPayload)
            .metadata(AerRequestMetadata.builder()
                .year(Year.now())
                .build())
            .build();

        RequestCreateAccountStatusValidationResult requestCreateAccountStatusValidationResult
                = new RequestCreateAccountStatusValidationResult(true, MrtmAccountStatus.LIVE);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW)))
                .thenReturn(requestCreateAccountStatusValidationResult);
        when(aerService.existsAerByAccountIdAndYear(accountId, Year.now())).thenReturn(false);

        // Invoke
        aerCreateVirService.createRequestVir(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestCreateValidatorService, times(1))
            .validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW));
        verify(virCreationService, times(1)).createRequestVir(requestId, accountId);
        assertThat(((AerRequestPayload) request.getPayload()).isVirTriggered()).isTrue();
    }

    @Test
    void createRequestVir_not_triggered_when_aer_is_reinitiated() {
        
        final long accountId = 1L;
        final String requestId = "AEM-1";
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .virTriggered(false)
            .verificationPerformed(true)
            .verificationReport(AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                    .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                        .uncorrectedNonConformities(Set.of(UncorrectedItem.builder().build()))
                        .priorYearIssues(Set.of(VerifierComment.builder().build()))
                        .build())
                    .recommendedImprovements(AerRecommendedImprovements.builder()
                        .exist(true)
                        .recommendedImprovements(Set.of(VerifierComment.builder().build()))
                        .build())
                    .build())
                .build())
            .build();

        final Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                    .resourceId(String.valueOf(accountId))
                    .build()))
            .payload(aerRequestPayload)
            .metadata(AerRequestMetadata.builder()
                .year(Year.now())
                .build())
            .build();

        RequestCreateAccountStatusValidationResult requestCreateAccountStatusValidationResult
                = new RequestCreateAccountStatusValidationResult(true, MrtmAccountStatus.LIVE);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW)))
            .thenReturn(requestCreateAccountStatusValidationResult);
        when(aerService.existsAerByAccountIdAndYear(accountId, Year.now())).thenReturn(true);

        // Invoke
        aerCreateVirService.createRequestVir(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestCreateValidatorService, times(1))
            .validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW));
        verify(virCreationService, never()).createRequestVir(anyString(), eq(accountId));
        assertThat(((AerRequestPayload) request.getPayload()).isVirTriggered()).isFalse();
    }

    @Test
    void createRequestVir_vir_not_triggered() {
        String accountId = "1";
        final String requestId = "AEM-1";
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .virTriggered(false)
            .verificationPerformed(false)
            .build();
        final Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                    .resourceId(accountId)
                    .build()))
            .payload(aerRequestPayload)
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);

        // Invoke
        aerCreateVirService.createRequestVir(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestCreateValidatorService, never()).validateAccountStatuses(anyLong(), anySet());
        verify(virCreationService, never()).createRequestVir(anyString(), eq(Long.valueOf(accountId)));
        assertThat(((AerRequestPayload) request.getPayload()).isVirTriggered()).isFalse();
    }

    @Test
    void createRequestVir_vir_not_valid_for_aer() {

        final long accountId = 1L;
        final String requestId = "AEM-1";
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .virTriggered(false)
            .verificationPerformed(true)
            .verificationReport(AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                    .uncorrectedNonConformities(AerUncorrectedNonConformities.builder()
                        .existPriorYearIssues(false)
                        .build())
                    .recommendedImprovements(AerRecommendedImprovements.builder()
                        .exist(false)
                        .build())
                    .build())
                .build())
            .build();

        final Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                    .resourceId(String.valueOf(accountId))
                    .build()))
            .payload(aerRequestPayload)
            .metadata(AerRequestMetadata.builder()
                .year(Year.now())
                .build())
            .build();

        RequestCreateAccountStatusValidationResult requestCreateAccountStatusValidationResult
                = new RequestCreateAccountStatusValidationResult(true);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW)))
            .thenReturn(requestCreateAccountStatusValidationResult);

        // Invoke
        aerCreateVirService.createRequestVir(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestCreateValidatorService, times(1))
            .validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW));
        verify(virCreationService, never()).createRequestVir(anyString(), eq(accountId));
        assertThat(((AerRequestPayload) request.getPayload()).isVirTriggered()).isFalse();
    }

    @Test
    void createRequestVir_not_valid_account() {
        
        final long accountId = 1L;
        final String requestId = "AEM-1";
        final AerRequestPayload aerRequestPayload = AerRequestPayload.builder()
            .virTriggered(false)
            .verificationPerformed(true)
            .verificationReport(AerVerificationReport.builder()
                .verificationData(AerVerificationData.builder()
                    .build())
                .build())
            .build();
        
        final Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                    .resourceType(ResourceType.ACCOUNT)
                    .resourceId(String.valueOf(accountId))
                    .build()))
            .payload(aerRequestPayload)
                .metadata(AerRequestMetadata.builder().year(Year.now()).build())
            .build();

        RequestCreateAccountStatusValidationResult requestCreateAccountStatusValidationResult
                = new RequestCreateAccountStatusValidationResult(false, MrtmAccountStatus.LIVE);

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestCreateValidatorService.validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW)))
            .thenReturn(requestCreateAccountStatusValidationResult);

        // Invoke
        aerCreateVirService.createRequestVir(requestId);

        // Verify
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestCreateValidatorService, times(1))
            .validateAccountStatuses(accountId, Set.of(MrtmAccountStatus.LIVE, MrtmAccountStatus.NEW));
        verify(virCreationService, never()).createRequestVir(anyString(), eq(accountId));
        assertThat(((AerRequestPayload) request.getPayload()).isVirTriggered()).isFalse();
    }
}
