package uk.gov.mrtm.api.reporting.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerEntity;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerSubmitParams;
import uk.gov.mrtm.api.reporting.repository.AerRepository;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;

import java.time.Year;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerServiceTest {

    @InjectMocks
    private AerService aerService;

    @Mock
    private AerRepository aerRepository;

    @Mock
    private AerValidatorService aerValidatorService;

    @Mock
    private ReportableEmissionsService reportableEmissionsService;


    @Test
    void submitAer() {
        Long accountId = 100L;
        Year reportingYear = Year.of(2023);

        AerContainer aerContainer = Mockito.mock(AerContainer.class);
        when(aerContainer.getReportingYear()).thenReturn(reportingYear);
        when(aerContainer.getReportingRequired()).thenReturn(Boolean.TRUE);

        AerTotalReportableEmissions totalReportableEmissions = Mockito.mock(AerTotalReportableEmissions.class);

        when(reportableEmissionsService.calculateTotalReportableEmissions(aerContainer)).thenReturn(totalReportableEmissions);

        AerSubmitParams params = AerSubmitParams.builder()
                .aerContainer(aerContainer)
                .accountId(accountId)
                .build();
        AerEntity aerEntity = AerEntity.builder()
                .id("MAR100-2023")
                .aerContainer(aerContainer)
                .accountId(accountId)
                .year(reportingYear)
                .build();

        //invoke
        aerService.submitAer(params);

        //verify
        verify(reportableEmissionsService)
            .updateReportableEmissions(totalReportableEmissions, reportingYear, accountId, true);
        verify(reportableEmissionsService).calculateTotalReportableEmissions(aerContainer);
        verify(aerValidatorService).validate(aerContainer, accountId);
        verify(aerRepository).save(aerEntity);

        verifyNoMoreInteractions(aerRepository, aerValidatorService, reportableEmissionsService);
    }

    @Test
    void submitAer_when_no_reporting_required() {
        Long accountId = 100L;
        Year reportingYear = Year.of(2023);

        AerContainer aerContainer = Mockito.mock(AerContainer.class);
        when(aerContainer.getReportingYear()).thenReturn(reportingYear);
        when(aerContainer.getReportingRequired()).thenReturn(Boolean.FALSE);

        AerSubmitParams params = AerSubmitParams.builder()
                .aerContainer(aerContainer)
                .accountId(accountId)
                .build();

        //invoke
        aerService.submitAer(params);

        //verify
        verifyNoInteractions(reportableEmissionsService, aerValidatorService, aerRepository);
    }
}
