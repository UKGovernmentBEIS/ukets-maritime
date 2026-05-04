package uk.gov.mrtm.api.integration.external.verification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerificationEntity;
import uk.gov.mrtm.api.integration.external.verification.repository.StagingAerVerificationRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerVerificationThirdPartyProviderViewServiceTest {

    private static final long ACCOUNT_ID = 1L;
    private static final Year YEAR = Year.now();

    @InjectMocks
    private AerVerificationThirdPartyProviderViewService service;

    @Mock
    private StagingAerVerificationRepository stagingAerVerificationRepository;

    @Test
    void getThirdPartyDataProviderInfo_staging_aer_verification_exists() {
        LocalDateTime now = LocalDateTime.now();
        StagingEmissionsMonitoringPlan payload = mock(StagingEmissionsMonitoringPlan.class);
        StagingAerVerificationEntity stagingEmissionsMonitoringPlan = StagingAerVerificationEntity
            .builder()
            .providerName("name")
            .importedOn(now)
            .payload(payload)
            .updatedOn(now.minusDays(1))
            .createdOn(now.minusDays(2))
            .build();
        ThirdPartyDataProviderStagingDetailsDTO expectedResponse = ThirdPartyDataProviderStagingDetailsDTO.builder()
            .providerName("name")
            .receivedOn(now.minusDays(1))
            .payload(payload)
            .importedOn(now)
            .build();
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
            .reportingYear(YEAR)
            .build();

        when(stagingAerVerificationRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.ofNullable(stagingEmissionsMonitoringPlan));

        ThirdPartyDataProviderStagingDetailsDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, taskPayload);

        assertEquals(expectedResponse, actualResponse);
        verify(stagingAerVerificationRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(stagingAerVerificationRepository);
    }

    @Test
    void getThirdPartyDataProviderInfo_staging_aer_verification_not_exists() {
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload = AerApplicationVerificationSubmitRequestTaskPayload.builder()
            .reportingYear(YEAR)
            .build();

        when(stagingAerVerificationRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR)).thenReturn(Optional.empty());

        ThirdPartyDataProviderStagingDetailsDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, taskPayload);

        assertNull(actualResponse);
        verify(stagingAerVerificationRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(stagingAerVerificationRepository);
    }

    @Test
    void getTypes() {
        assertThat(service.getTypes()).isEqualTo(List.of(MrtmRequestTaskType.AER_APPLICATION_VERIFICATION_SUBMIT,
            MrtmRequestTaskType.AER_AMEND_APPLICATION_VERIFICATION_SUBMIT));
    }
}