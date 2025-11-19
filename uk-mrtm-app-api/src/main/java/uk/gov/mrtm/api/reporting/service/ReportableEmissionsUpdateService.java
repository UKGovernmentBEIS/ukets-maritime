package uk.gov.mrtm.api.reporting.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.request.MaritimeEmissionsUpdatedEventListenerResolver;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsEntity;
import uk.gov.mrtm.api.reporting.domain.ReportableEmissionsSaveParams;
import uk.gov.mrtm.api.reporting.domain.common.ReportableEmissionsUpdatedEvent;
import uk.gov.mrtm.api.reporting.repository.ReportableEmissionsRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportableEmissionsUpdateService {

    private final ReportableEmissionsRepository reportableEmissionsRepository;
    private final MaritimeEmissionsUpdatedEventListenerResolver eventPublisher;

    @Transactional
    public ReportableEmissionsUpdatedSubmittedEventDetails saveReportableEmissions(ReportableEmissionsSaveParams saveParams) {
        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails = ReportableEmissionsUpdatedSubmittedEventDetails
            .builder()
            .notifiedRegistry(false)
            .build();

        Optional<ReportableEmissionsEntity> optionalReportableEmissions = reportableEmissionsRepository
            .findByAccountIdAndYear(saveParams.getAccountId(), saveParams.getYear());

        if (optionalReportableEmissions.isPresent()) {
            ReportableEmissionsEntity emissionsEntity = optionalReportableEmissions.get();
            if(saveParams.isFromDoe() || !emissionsEntity.isFromDoe()) {
                emissionsEntity.setFromDoe(saveParams.isFromDoe());
                emissionsEntity.setExempted(saveParams.isExempted());
                emissionsEntity.setSurrenderEmissions(saveParams.getReportableEmissions().getSurrenderEmissions());
                emissionsEntity.setTotalEmissions((saveParams.getReportableEmissions().getTotalEmissions()));
                emissionsEntity.setLessIslandFerryDeduction((saveParams.getReportableEmissions().getLessIslandFerryDeduction()));
                emissionsEntity.setLess5PercentIceClassDeduction((saveParams.getReportableEmissions().getLess5PercentIceClassDeduction()));
                eventDetails = notifyRegistry(saveParams);
            }
        } else {
            ReportableEmissionsEntity reportableEmissionsEntity =
                ReportableEmissionsEntity.builder()
                    .accountId(saveParams.getAccountId())
                    .year(saveParams.getYear())
                    .surrenderEmissions(saveParams.getReportableEmissions().getSurrenderEmissions())
                    .totalEmissions(saveParams.getReportableEmissions().getTotalEmissions())
                    .lessIslandFerryDeduction(saveParams.getReportableEmissions().getLessIslandFerryDeduction())
                    .less5PercentIceClassDeduction(saveParams.getReportableEmissions().getLess5PercentIceClassDeduction())
                    .isFromDoe(saveParams.isFromDoe())
                    .isExempted(saveParams.isExempted())
                    .build();
            reportableEmissionsRepository.save(reportableEmissionsEntity);
            eventDetails = notifyRegistry(saveParams);
        }

        return eventDetails;
    }

    private ReportableEmissionsUpdatedSubmittedEventDetails notifyRegistry(ReportableEmissionsSaveParams saveParams) {
        return eventPublisher.onAccountCreatedEvent(ReportableEmissionsUpdatedEvent.builder()
                .accountId(saveParams.getAccountId())
                .isFromDoe(saveParams.isFromDoe())
                .reportableEmissions(saveParams.getReportableEmissions().getSurrenderEmissions())
                .year(saveParams.getYear())
                .isFromRegulator(saveParams.isFromRegulator())
                .build());
    }
}
