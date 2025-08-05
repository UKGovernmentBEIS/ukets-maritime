package uk.gov.mrtm.api.reporting.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.AerEntity;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.common.AerSubmitParams;
import uk.gov.mrtm.api.reporting.repository.AerRepository;
import uk.gov.mrtm.api.reporting.util.AerIdentifierGenerator;
import uk.gov.mrtm.api.reporting.validation.AerValidatorService;

import java.time.Year;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AerService {

    private final AerRepository aerRepository;
    private final AerValidatorService aerValidatorService;
    private final ReportableEmissionsService reportableEmissionsService;

    public boolean existsAerByAccountIdAndYear(Long accountId, Year year) {
        return aerRepository.existsByAccountIdAndYear(accountId, year);
    }

    @Transactional
    public Optional<AerTotalReportableEmissions> submitAer(AerSubmitParams params) {
        AerContainer aerContainer = params.getAerContainer();
        Long accountId = params.getAccountId();
        Year reportingYear = aerContainer.getReportingYear();

        AerTotalReportableEmissions reportableEmissions = null;

        if (Boolean.TRUE.equals(aerContainer.getReportingRequired())) {

            reportableEmissions = reportableEmissionsService.calculateTotalReportableEmissions(aerContainer);
            reportableEmissionsService.updateReportableEmissions(
                reportableEmissions, aerContainer.getReportingYear(), accountId, true);

            aerValidatorService.validate(aerContainer, accountId);

            // Save AER to DB
            AerEntity aerEntity = AerEntity.builder()
                    .id(AerIdentifierGenerator.generate(accountId, reportingYear.getValue()))
                    .aerContainer(aerContainer)
                    .accountId(accountId)
                    .year(reportingYear)
                    .build();
            aerRepository.save(aerEntity);
        }

        return Optional.ofNullable(reportableEmissions);
    }
}
