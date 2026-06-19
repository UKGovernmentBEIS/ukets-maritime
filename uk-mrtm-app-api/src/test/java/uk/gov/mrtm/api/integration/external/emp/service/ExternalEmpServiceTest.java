package uk.gov.mrtm.api.integration.external.emp.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.StagingEmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.integration.external.emp.transform.ExternalEmpMapper;
import uk.gov.mrtm.api.integration.external.emp.repository.StagingEmissionsMonitoringPlanRepository;
import uk.gov.mrtm.api.integration.external.emp.validation.ExternalEmpValidator;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProvider;
import uk.gov.netz.api.thirdpartydataprovider.repository.ThirdPartyDataProviderRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ExternalEmpServiceTest {

    @InjectMocks
    private ExternalEmpService externalEmpService;

    @Mock
    private ExternalEmpValidator validator;
    @Mock
    private ExternalEmpMapper mapper;
    @Mock
    private StagingEmissionsMonitoringPlanRepository stagingEmpRepository;
    @Mock
    private MrtmAccountRepository mrtmAccountRepository;
    @Mock
    private ThirdPartyDataProviderRepository thirdPartyDataProviderRepository;
    @Mock
    private DateService dateService;

    @Test
    void submitEmissionsMonitoringPlanData_staging_emp_is_not_present() {
        ExternalEmissionsMonitoringPlan external = mock(ExternalEmissionsMonitoringPlan.class);
        String companyImoNumber = "1234567";
        long thirdPartyDataProviderId = 1L;
        AppUser appUser = AppUser.builder()
            .authorities(List.of(AppAuthority.builder().thirdPartyDataProviderId(thirdPartyDataProviderId).build()))
            .build();
        ThirdPartyDataProvider  thirdPartyDataProvider = ThirdPartyDataProvider.builder().name("provider name").build();
        Long accountId = 1234L;
        LocalDateTime now = LocalDateTime.now();
        MrtmAccount account = MrtmAccount.builder().id(accountId).build();
        StagingEmissionsMonitoringPlan  staging = mock(StagingEmissionsMonitoringPlan.class);
        StagingEmissionsMonitoringPlanEntity expectedStagingEmpPlanEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .payload(staging)
            .accountId(accountId)
            .createdOn(now)
            .updatedOn(now)
            .providerName("provider name")
            .build();

        when(mapper.toStagingEmissionsMonitoringPlan(external)).thenReturn(staging);
        when(mrtmAccountRepository.findByImoNumber(companyImoNumber)).thenReturn(Optional.ofNullable(account));
        when(thirdPartyDataProviderRepository.findById(thirdPartyDataProviderId)).thenReturn(Optional.ofNullable(thirdPartyDataProvider));
        when(stagingEmpRepository.findByAccountId(accountId)).thenReturn(Optional.empty());
        when(dateService.getLocalDateTime()).thenReturn(now);

        externalEmpService.submitEmissionsMonitoringPlanData(external, companyImoNumber, appUser);
        verify(mapper).toStagingEmissionsMonitoringPlan(external);
        verify(validator).validate(staging, companyImoNumber);
        verify(mrtmAccountRepository).findByImoNumber(companyImoNumber);
        verify(stagingEmpRepository).findByAccountId(accountId);
        verify(dateService).getLocalDateTime();
        verify(thirdPartyDataProviderRepository).findById(thirdPartyDataProviderId);
        verify(stagingEmpRepository).save(expectedStagingEmpPlanEntity);

        verifyNoMoreInteractions(mapper, validator, mrtmAccountRepository, stagingEmpRepository,
            dateService, thirdPartyDataProviderRepository);
    }


    @Test
    void submitEmissionsMonitoringPlanData_staging_emp_is_present() {
        ExternalEmissionsMonitoringPlan external = mock(ExternalEmissionsMonitoringPlan.class);
        String companyImoNumber = "1234567";
        long thirdPartyDataProviderId = 1L;
        AppUser appUser = AppUser.builder()
            .authorities(List.of(AppAuthority.builder().thirdPartyDataProviderId(thirdPartyDataProviderId).build()))
            .build();
        ThirdPartyDataProvider  thirdPartyDataProvider = ThirdPartyDataProvider.builder().name("provider name").build();
        Long accountId = 1234L;
        Long stagingEmpId = 4321L;
        LocalDateTime now = LocalDateTime.now();
        MrtmAccount account = MrtmAccount.builder().id(accountId).build();
        StagingEmissionsMonitoringPlan  staging = mock(StagingEmissionsMonitoringPlan.class);
        StagingEmissionsMonitoringPlanEntity stagingEmpPlanEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .id(stagingEmpId)
            .payload(staging)
            .accountId(accountId)
            .updatedOn(now.minusDays(2))
            .providerName("old provider name")
            .build();
        StagingEmissionsMonitoringPlanEntity expectedStagingEmpPlanEntity = StagingEmissionsMonitoringPlanEntity.builder()
            .id(stagingEmpId)
            .payload(staging)
            .accountId(accountId)
            .updatedOn(now)
            .providerName("provider name")
            .build();

        when(mapper.toStagingEmissionsMonitoringPlan(external)).thenReturn(staging);
        when(mrtmAccountRepository.findByImoNumber(companyImoNumber)).thenReturn(Optional.ofNullable(account));
        when(thirdPartyDataProviderRepository.findById(thirdPartyDataProviderId)).thenReturn(Optional.ofNullable(thirdPartyDataProvider));
        when(stagingEmpRepository.findByAccountId(accountId)).thenReturn(Optional.of(stagingEmpPlanEntity));
        when(dateService.getLocalDateTime()).thenReturn(now);

        externalEmpService.submitEmissionsMonitoringPlanData(external, companyImoNumber, appUser);
        verify(mapper).toStagingEmissionsMonitoringPlan(external);
        verify(validator).validate(staging, companyImoNumber);
        verify(mrtmAccountRepository).findByImoNumber(companyImoNumber);
        verify(stagingEmpRepository).findByAccountId(accountId);
        verify(thirdPartyDataProviderRepository).findById(thirdPartyDataProviderId);
        verify(dateService).getLocalDateTime();
        verify(stagingEmpRepository).save(expectedStagingEmpPlanEntity);

        verifyNoMoreInteractions(mapper, validator, mrtmAccountRepository,
            stagingEmpRepository, dateService, thirdPartyDataProviderRepository);
    }
}