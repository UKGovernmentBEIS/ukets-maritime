package uk.gov.mrtm.api.reporting.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.request.MaritimeEmissionsUpdatedEventListenerResolver;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsEntity;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;

import java.math.BigDecimal;
import java.time.Year;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportableEmissionsUpdateServiceTest {

    @InjectMocks
    private ReportableEmissionsUpdateService reportableEmissionsUpdateService;

    @Mock
    private ReportableEmissionsRepository reportableEmissionsRepository;
    
    @Mock
    private MaritimeEmissionsUpdatedEventListenerResolver eventPublisher;

    @Test
    void saveReportableEmissions_new_entry() {
        Long accountId = 1L;
        Year year = Year.now();
        BigDecimal reportableEmissions = BigDecimal.valueOf(500);
        BigDecimal totalEmissions = BigDecimal.valueOf(250);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(100);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(50);
        ReportableEmissionsSaveParams params = ReportableEmissionsSaveParams.builder()
                .accountId(accountId)
                .year(year)
                .reportableEmissions(AerTotalReportableEmissions.builder()
                        .surrenderEmissions(reportableEmissions)
                        .totalEmissions(totalEmissions)
                        .lessIslandFerryDeduction(lessIslandFerryDeduction)
                        .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                        .build())
                .isFromDoe(false)
                .build();

        when(reportableEmissionsRepository.findByAccountIdAndYear(accountId, year)).thenReturn(Optional.empty());

        // Invoke
        reportableEmissionsUpdateService.saveReportableEmissions(params);

        // Verify
        ArgumentCaptor<ReportableEmissionsEntity> emissionsArgumentCaptor = ArgumentCaptor.forClass(ReportableEmissionsEntity.class);
        verify(reportableEmissionsRepository, times(1)).save(emissionsArgumentCaptor.capture());
        ReportableEmissionsEntity savedEntity = emissionsArgumentCaptor.getValue();

        assertNotNull(savedEntity);
        assertEquals(accountId, savedEntity.getAccountId());
        assertEquals(year, savedEntity.getYear());
        assertEquals(reportableEmissions, savedEntity.getSurrenderEmissions());
        assertEquals(totalEmissions, savedEntity.getTotalEmissions());
        assertEquals(lessIslandFerryDeduction, savedEntity.getLessIslandFerryDeduction());
        assertEquals(less5PercentIceClassDeduction, savedEntity.getLess5PercentIceClassDeduction());
        assertEquals(params.isFromDoe(), savedEntity.isFromDoe());
        verify(eventPublisher).onAccountCreatedEvent(ReportableEmissionsUpdatedEvent.builder()
        		.accountId(accountId)
                .year(year)
                .reportableEmissions(reportableEmissions)
                .isFromDoe(false)
        		.build());
    }

    @Test
    void saveReportableEmissions_params_not_from_dre_and_entity_not_from_dre() {
        Long accountId = 1L;
        Year year = Year.now();
        Long reportableEmissionsEntityId = 10L;
        BigDecimal newReportableEmissions = BigDecimal.valueOf(500);
        BigDecimal totalEmissions = BigDecimal.valueOf(250);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(100);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(50);
        ReportableEmissionsSaveParams params = ReportableEmissionsSaveParams.builder()
                .accountId(accountId)
                .year(year)
                .reportableEmissions(AerTotalReportableEmissions.builder()
                        .surrenderEmissions(newReportableEmissions)
                        .totalEmissions(totalEmissions)
                        .lessIslandFerryDeduction(lessIslandFerryDeduction)
                        .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                        .build())
                .isFromDoe(false)
                .build();
        ReportableEmissionsEntity reportableEmissionsEntity = ReportableEmissionsEntity.builder()
                .id(reportableEmissionsEntityId)
                .accountId(accountId)
                .year(year)
                .surrenderEmissions(BigDecimal.valueOf(200))
                .isFromDoe(false)
                .build();

        when(reportableEmissionsRepository.findByAccountIdAndYear(accountId, year)).thenReturn(Optional.of(reportableEmissionsEntity));

        // Invoke
        reportableEmissionsUpdateService.saveReportableEmissions(params);

        // Verify
        assertEquals(reportableEmissionsEntityId, reportableEmissionsEntity.getId());
        assertEquals(newReportableEmissions, reportableEmissionsEntity.getSurrenderEmissions());
        assertEquals(totalEmissions, reportableEmissionsEntity.getTotalEmissions());
        assertEquals(lessIslandFerryDeduction, reportableEmissionsEntity.getLessIslandFerryDeduction());
        assertEquals(less5PercentIceClassDeduction, reportableEmissionsEntity.getLess5PercentIceClassDeduction());

        verify(reportableEmissionsRepository, never()).save(any());

        verify(eventPublisher).onAccountCreatedEvent(ReportableEmissionsUpdatedEvent.builder()
        		.accountId(accountId)
                .year(year)
                .reportableEmissions(newReportableEmissions)
                .isFromDoe(false)
        		.build());
    }

    @Test
    void saveReportableEmissions_params_not_from_dre_and_entity_from_dre() {
        Long accountId = 1L;
        Year year = Year.now();
        Long reportableEmissionsEntityId = 10L;
        BigDecimal newReportableEmissions = BigDecimal.valueOf(500);
        BigDecimal totalEmissions = BigDecimal.valueOf(250);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(100);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(50);
        ReportableEmissionsSaveParams params = ReportableEmissionsSaveParams.builder()
                .accountId(accountId)
                .year(year)
                .reportableEmissions(AerTotalReportableEmissions.builder()
                        .surrenderEmissions(newReportableEmissions)
                        .build())
                .isFromDoe(false)
                .build();
        ReportableEmissionsEntity reportableEmissionsEntity = ReportableEmissionsEntity.builder()
                .id(reportableEmissionsEntityId)
                .accountId(accountId)
                .year(year)
                .surrenderEmissions(BigDecimal.valueOf(200))
                .totalEmissions(totalEmissions)
                .lessIslandFerryDeduction(lessIslandFerryDeduction)
                .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                .isFromDoe(true)
                .build();

        when(reportableEmissionsRepository.findByAccountIdAndYear(params.getAccountId(), params.getYear()))
                .thenReturn(Optional.of(reportableEmissionsEntity));

        // Invoke
        reportableEmissionsUpdateService.saveReportableEmissions(params);

        // Verify
        assertEquals(reportableEmissionsEntityId, reportableEmissionsEntity.getId());
        assertEquals(BigDecimal.valueOf(200), reportableEmissionsEntity.getSurrenderEmissions());
        assertEquals(totalEmissions, reportableEmissionsEntity.getTotalEmissions());
        assertEquals(lessIslandFerryDeduction, reportableEmissionsEntity.getLessIslandFerryDeduction());
        assertEquals(less5PercentIceClassDeduction, reportableEmissionsEntity.getLess5PercentIceClassDeduction());

        verify(reportableEmissionsRepository, never()).save(any());
        verifyNoInteractions(eventPublisher);
    }

    @Test
    void saveReportableEmissions_params_from_dre_and_entity_from_dre() {
        Long accountId = 1L;
        Year year = Year.now();
        Long reportableEmissionsEntityId = 10L;
        BigDecimal newReportableEmissions = BigDecimal.valueOf(500);
        BigDecimal totalEmissions = BigDecimal.valueOf(250);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(100);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(50);
        ReportableEmissionsSaveParams params = ReportableEmissionsSaveParams.builder()
                .accountId(accountId)
                .year(year)
                .reportableEmissions(AerTotalReportableEmissions.builder()
                        .surrenderEmissions(newReportableEmissions)
                        .totalEmissions(totalEmissions)
                        .lessIslandFerryDeduction(lessIslandFerryDeduction)
                        .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                        .build())
                .isFromDoe(true)
                .build();
        ReportableEmissionsEntity reportableEmissionsEntity = ReportableEmissionsEntity.builder()
                .id(reportableEmissionsEntityId)
                .accountId(accountId)
                .year(year)
                .surrenderEmissions(BigDecimal.valueOf(200))
                .isFromDoe(true)
                .build();

        when(reportableEmissionsRepository.findByAccountIdAndYear(params.getAccountId(), params.getYear()))
                .thenReturn(Optional.of(reportableEmissionsEntity));

        // Invoke
        reportableEmissionsUpdateService.saveReportableEmissions(params);

        // Verify
        assertEquals(reportableEmissionsEntityId, reportableEmissionsEntity.getId());
        assertEquals(newReportableEmissions, reportableEmissionsEntity.getSurrenderEmissions());
        assertEquals(totalEmissions, reportableEmissionsEntity.getTotalEmissions());
        assertEquals(lessIslandFerryDeduction, reportableEmissionsEntity.getLessIslandFerryDeduction());
        assertEquals(less5PercentIceClassDeduction, reportableEmissionsEntity.getLess5PercentIceClassDeduction());

        verify(reportableEmissionsRepository, never()).save(any());

        verify(eventPublisher).onAccountCreatedEvent(ReportableEmissionsUpdatedEvent.builder()
        		.accountId(accountId)
                .year(year)
                .reportableEmissions(newReportableEmissions)
                .isFromDoe(true)
        		.build());
    }

    @Test
    void saveReportableEmissions_params_from_dre_and_entity_not_from_dre() {
        Long accountId = 1L;
        Year year = Year.now();
        Long reportableEmissionsEntityId = 10L;
        BigDecimal newReportableEmissions = BigDecimal.valueOf(500);
        BigDecimal totalEmissions = BigDecimal.valueOf(250);
        BigDecimal lessIslandFerryDeduction = BigDecimal.valueOf(100);
        BigDecimal less5PercentIceClassDeduction = BigDecimal.valueOf(50);
        ReportableEmissionsSaveParams params = ReportableEmissionsSaveParams.builder()
                .accountId(accountId)
                .year(year)
                .reportableEmissions(AerTotalReportableEmissions.builder()
                        .surrenderEmissions(newReportableEmissions)
                        .totalEmissions(totalEmissions)
                        .lessIslandFerryDeduction(lessIslandFerryDeduction)
                        .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
                        .build())
                .isFromDoe(true)
                .build();
        ReportableEmissionsEntity reportableEmissionsEntity = ReportableEmissionsEntity.builder()
                .id(reportableEmissionsEntityId)
                .accountId(accountId)
                .year(year)
                .surrenderEmissions(BigDecimal.valueOf(200))
                .isFromDoe(false)
                .build();

        when(reportableEmissionsRepository.findByAccountIdAndYear(params.getAccountId(), params.getYear()))
                .thenReturn(Optional.of(reportableEmissionsEntity));

        // Invoke
        reportableEmissionsUpdateService.saveReportableEmissions(params);

        // Verify
        assertEquals(reportableEmissionsEntityId, reportableEmissionsEntity.getId());
        assertEquals(newReportableEmissions, reportableEmissionsEntity.getSurrenderEmissions());
        assertEquals(totalEmissions, reportableEmissionsEntity.getTotalEmissions());
        assertEquals(lessIslandFerryDeduction, reportableEmissionsEntity.getLessIslandFerryDeduction());
        assertEquals(less5PercentIceClassDeduction, reportableEmissionsEntity.getLess5PercentIceClassDeduction());

        verify(reportableEmissionsRepository, never()).save(any());

        verify(eventPublisher).onAccountCreatedEvent(ReportableEmissionsUpdatedEvent.builder()
        		.accountId(accountId)
                .year(year)
                .reportableEmissions(newReportableEmissions)
                .isFromDoe(true)
        		.build());
    }
}
