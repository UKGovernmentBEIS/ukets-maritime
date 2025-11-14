package uk.gov.mrtm.api.reporting.service;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.utils.AerEmissionsUtils;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class ReportableEmissionsService {

    private final ReportableEmissionsUpdateService reportableEmissionsUpdateService;
    private final ReportableEmissionsRepository reportableEmissionsRepository;

    @Transactional
    public ReportableEmissionsUpdatedSubmittedEventDetails saveReportableEmissions(ReportableEmissionsSaveParams saveParams) {
        return reportableEmissionsUpdateService.saveReportableEmissions(saveParams);
    }

    @Transactional
    public void updateReportableEmissionsExemptedFlag(Long accountId, Year year, boolean exempted) {
        reportableEmissionsRepository.findByAccountIdAndYear(accountId, year)
                .ifPresent(entity -> entity.setExempted(exempted));

    }

    @Transactional
    public void deleteReportableEmissions(Long accountId, Year year) {
        reportableEmissionsRepository.findByAccountIdAndYear(accountId, year)
                .ifPresent(reportableEmissionsRepository::delete);
    }

    @Transactional
    public ReportableEmissionsUpdatedSubmittedEventDetails updateReportableEmissions(
        AerTotalReportableEmissions totalReportableEmissions, Year reportingYear,
        Long accountId, boolean isFromRegulator) {

        ReportableEmissionsSaveParams reportableEmissionsSaveParams =
                ReportableEmissionsSaveParams.builder()
                        .accountId(accountId)
                        .year(reportingYear)
                        .reportableEmissions(totalReportableEmissions)
                        .isFromDoe(false)
                        .isFromRegulator(isFromRegulator)
                        .build();

        return saveReportableEmissions(reportableEmissionsSaveParams);
    }

    public AerTotalReportableEmissions calculateTotalReportableEmissions(AerContainer aerContainer) {

        final AerVerificationReport verificationReport = aerContainer.getVerificationReport();
        return ObjectUtils.isNotEmpty(verificationReport) && Boolean.FALSE.equals(verificationReport.getVerificationData().getOpinionStatement().getEmissionsCorrect()) ?
                AerTotalReportableEmissions.builder()
                        .totalEmissions(verificationReport.getVerificationData().getOpinionStatement().getManuallyProvidedTotalEmissions())
                        .surrenderEmissions(verificationReport.getVerificationData().getOpinionStatement().getManuallyProvidedSurrenderEmissions())
                        .lessVoyagesInNorthernIrelandDeduction(verificationReport.getVerificationData().getOpinionStatement().getManuallyProvidedLessVoyagesInNorthernIrelandDeduction())
                        .build() :
                AerEmissionsUtils.getAerTotalReportableEmissions(aerContainer.getAer().getTotalEmissions());
    }
}
