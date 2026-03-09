package uk.gov.mrtm.api.integration.external.emp.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderDTO;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;

import java.time.LocalDateTime;
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
class EmpThirdPartyProviderViewServiceTest {

    private static final long ACCOUNT_ID = 1L;

    @InjectMocks
    private EmpThirdPartyProviderViewService service;

    @Mock
    private StagingEmissionsMonitoringPlanRepository stagingEmpRepository;

    @Test
    void getThirdPartyDataProviderInfo_staging_emp_exists() {
        LocalDateTime  now = LocalDateTime.now();
        StagingEmissionsMonitoringPlan payload = mock(StagingEmissionsMonitoringPlan.class);
        StagingEmissionsMonitoringPlanEntity stagingEmissionsMonitoringPlan = StagingEmissionsMonitoringPlanEntity
            .builder()
            .providerName("name")
            .importedOn(now)
            .payload(payload)
            .updatedOn(now.minusDays(1))
            .createdOn(now.minusDays(2))
            .build();
        ThirdPartyDataProviderDTO expectedResponse = ThirdPartyDataProviderDTO.builder()
            .providerName("name")
            .receivedOn(now.minusDays(1))
            .payload(payload)
            .importedOn(now)
            .build();

        when(stagingEmpRepository.findByAccountId(ACCOUNT_ID))
            .thenReturn(Optional.ofNullable(stagingEmissionsMonitoringPlan));

        ThirdPartyDataProviderDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, null);

        assertEquals(expectedResponse, actualResponse);
        verify(stagingEmpRepository).findByAccountId(ACCOUNT_ID);
        verifyNoMoreInteractions(stagingEmpRepository);
    }

    @Test
    void getThirdPartyDataProviderInfo_staging_emp_not_exists() {
        when(stagingEmpRepository.findByAccountId(ACCOUNT_ID)).thenReturn(Optional.empty());

        ThirdPartyDataProviderDTO actualResponse = service.getThirdPartyDataProviderInfo(ACCOUNT_ID, null);

        assertNull(actualResponse);
        verify(stagingEmpRepository).findByAccountId(ACCOUNT_ID);
        verifyNoMoreInteractions(stagingEmpRepository);
    }

    @Test
    void getTypes() {
        assertThat(service.getTypes()).isEqualTo(List.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_SUBMIT));
    }
}