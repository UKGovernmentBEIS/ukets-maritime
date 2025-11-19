package uk.gov.mrtm.api.reporting.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.domain.common.AerPortEmissionsMeasurement;
import uk.gov.mrtm.api.reporting.domain.totalemissions.AerTotalEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerOpinionStatement;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;

import java.math.BigDecimal;
import java.time.Year;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportableEmissionsServiceTest {

    @Mock
    private ReportableEmissionsUpdateService reportableEmissionsUpdateService;

    @Mock
    private ReportableEmissionsRepository reportableEmissionsRepository;

    @InjectMocks
    private ReportableEmissionsService reportableEmissionsService;

    @BeforeEach
    void setUp() {
        reportableEmissionsService = new ReportableEmissionsService(reportableEmissionsUpdateService, reportableEmissionsRepository);
    }

    @Test
    void saveReportableEmissions_ShouldCallUpdateService() {

        ReportableEmissionsSaveParams saveParams = mock(ReportableEmissionsSaveParams.class);

        reportableEmissionsService.saveReportableEmissions(saveParams);

        verify(reportableEmissionsUpdateService, times(1)).saveReportableEmissions(saveParams);
    }

    @ParameterizedTest
    @ValueSource(booleans = {true, false})
    void updateReportableEmissions(boolean isFromRegulator) {
        Long accountId = 1L;
        final Year reportingYear = Year.of(2025);
        AerTotalReportableEmissions totalReportableEmissions = mock(AerTotalReportableEmissions.class);
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails =
            mock(ReportableEmissionsUpdatedSubmittedEventDetails.class);
        ReportableEmissionsSaveParams saveParams = ReportableEmissionsSaveParams.builder()
            .accountId(accountId)
            .year(reportingYear)
            .reportableEmissions(totalReportableEmissions)
            .isFromDoe(false)
            .isFromRegulator(isFromRegulator)
            .build();

        when(reportableEmissionsUpdateService.saveReportableEmissions(saveParams)).thenReturn(eventDetails);
        final ReportableEmissionsUpdatedSubmittedEventDetails eventDetailsResponse =
                reportableEmissionsService.updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, isFromRegulator);

        assertEquals(eventDetailsResponse, eventDetails);
        verify(reportableEmissionsUpdateService).saveReportableEmissions(saveParams);

        verifyNoMoreInteractions(reportableEmissionsUpdateService);
        verifyNoInteractions(reportableEmissionsRepository);
    }

    @Test
    void calculateTotalReportableEmissions_incorrect() {
        BigDecimal totalEmissions = new BigDecimal("1");
        BigDecimal surrenderEmissions = new BigDecimal("2");
        BigDecimal lessIslandFerryDeduction = new BigDecimal("3");
        BigDecimal less5PercentIceClassDeduction = new BigDecimal("4");

        AerContainer aerContainer = AerContainer.builder()
            .aer(Aer.builder()
                .totalEmissions(AerTotalEmissions.builder()
                    .totalShipEmissionsSummary(new BigDecimal("123"))
                    .surrenderEmissionsSummary(new BigDecimal("123"))
                    .lessIslandFerryDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("123")).build())
                    .less5PercentIceClassDeduction(AerPortEmissionsMeasurement.builder().total(new BigDecimal("123")).build())
                    .build())
                .build())
            .verificationReport(AerVerificationReport.builder().verificationData(AerVerificationData.builder()
                .opinionStatement(
                    AerOpinionStatement.builder()
                        .emissionsCorrect(false)
                        .manuallyProvidedTotalEmissions(totalEmissions)
                        .manuallyProvidedSurrenderEmissions(surrenderEmissions)
                        .manuallyProvidedLessIslandFerryDeduction(lessIslandFerryDeduction)
                        .manuallyProvidedLess5PercentIceClassDeduction(less5PercentIceClassDeduction)
                        .build())
                    .build())
                .build())
            .build();

        AerTotalReportableEmissions expectedReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(totalEmissions)
            .surrenderEmissions(surrenderEmissions)
            .lessIslandFerryDeduction(lessIslandFerryDeduction)
            .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
            .build();

        AerTotalReportableEmissions actualReportableEmissions =
            reportableEmissionsService.calculateTotalReportableEmissions(aerContainer);

        assertEquals(expectedReportableEmissions, actualReportableEmissions);

        verifyNoInteractions(reportableEmissionsUpdateService, reportableEmissionsRepository);
    }

    @Test
    void calculateTotalReportableEmissions_correct() {
        BigDecimal totalEmissions = new BigDecimal("1");
        BigDecimal surrenderEmissions = new BigDecimal("2");
        BigDecimal lessIslandFerryDeduction = new BigDecimal("3");
        BigDecimal lessIslandFerryDeductionDecimal = new BigDecimal("3.1");
        BigDecimal less5PercentIceClassDeduction = new BigDecimal("4");
        BigDecimal less5PercentIceClassDeductionDecimal = new BigDecimal("3.9");

        AerContainer aerContainer = AerContainer.builder()
            .aer(Aer.builder()
                .totalEmissions(AerTotalEmissions.builder()
                    .totalShipEmissionsSummary(totalEmissions)
                    .surrenderEmissionsSummary(surrenderEmissions)
                    .lessIslandFerryDeduction(AerPortEmissionsMeasurement.builder().total(lessIslandFerryDeductionDecimal).build())
                    .less5PercentIceClassDeduction(AerPortEmissionsMeasurement.builder().total(less5PercentIceClassDeductionDecimal).build())
                    .build())
                .build())
            .verificationReport(AerVerificationReport.builder().verificationData(AerVerificationData.builder()
                    .opinionStatement(
                        AerOpinionStatement.builder()
                            .emissionsCorrect(true)
                            .manuallyProvidedTotalEmissions(new BigDecimal("123"))
                            .manuallyProvidedSurrenderEmissions(new BigDecimal("123"))
                            .manuallyProvidedLessIslandFerryDeduction(new BigDecimal("123"))
                            .manuallyProvidedLess5PercentIceClassDeduction(new BigDecimal("123"))
                            .build())
                    .build())
                .build())
            .build();

        AerTotalReportableEmissions expectedReportableEmissions = AerTotalReportableEmissions.builder()
            .totalEmissions(totalEmissions)
            .surrenderEmissions(surrenderEmissions)
            .lessIslandFerryDeduction(lessIslandFerryDeduction)
            .less5PercentIceClassDeduction(less5PercentIceClassDeduction)
            .build();

        AerTotalReportableEmissions actualReportableEmissions =
            reportableEmissionsService.calculateTotalReportableEmissions(aerContainer);

        assertEquals(expectedReportableEmissions, actualReportableEmissions);

        verifyNoInteractions(reportableEmissionsUpdateService, reportableEmissionsRepository);
    }
}