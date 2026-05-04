package uk.gov.mrtm.api.integration.external.aer.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.aer.domain.StagingAerEntity;
import uk.gov.mrtm.api.integration.external.aer.repository.StagingAerRepository;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;

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
class AerThirdPartyProviderViewServiceTest {

    private static final long ACCOUNT_ID = 1L;
    private static final Year YEAR = Year.now();

    @InjectMocks
    private AerThirdPartyProviderViewService service;

    @Mock
    private StagingAerRepository stagingAerRepository;

    @Test
    void getThirdPartyDataProviderInfo_staging_emp_exists() {
        LocalDateTime now = LocalDateTime.now();
        StagingEmissionsMonitoringPlan payload = mock(StagingEmissionsMonitoringPlan.class);
        StagingAerEntity stagingEmissionsMonitoringPlan = StagingAerEntity
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
        AerApplicationSubmitRequestTaskPayload taskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .reportingYear(YEAR)
            .build();

        when(stagingAerRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR))
            .thenReturn(Optional.ofNullable(stagingEmissionsMonitoringPlan));

        ThirdPartyDataProviderStagingDetailsDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, taskPayload);

        assertEquals(expectedResponse, actualResponse);
        verify(stagingAerRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(stagingAerRepository);
    }

    @Test
    void getThirdPartyDataProviderInfo_staging_emp_not_exists() {
        AerApplicationSubmitRequestTaskPayload taskPayload = AerApplicationSubmitRequestTaskPayload.builder()
            .reportingYear(YEAR)
            .build();

        when(stagingAerRepository.findByAccountIdAndYear(ACCOUNT_ID, YEAR)).thenReturn(Optional.empty());

        ThirdPartyDataProviderStagingDetailsDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, taskPayload);

        assertNull(actualResponse);
        verify(stagingAerRepository).findByAccountIdAndYear(ACCOUNT_ID, YEAR);
        verifyNoMoreInteractions(stagingAerRepository);
    }

    @Test
    void getTypes() {
        assertThat(service.getTypes()).isEqualTo(List.of(MrtmRequestTaskType.AER_APPLICATION_SUBMIT,
            MrtmRequestTaskType.AER_APPLICATION_AMENDS_SUBMIT));
    }
}