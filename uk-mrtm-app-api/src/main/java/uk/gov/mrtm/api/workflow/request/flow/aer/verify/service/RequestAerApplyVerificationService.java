package uk.gov.mrtm.api.workflow.request.flow.aer.verify.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerification;
import uk.gov.mrtm.api.integration.external.verification.domain.StagingAerVerificationEntity;
import uk.gov.mrtm.api.integration.external.verification.repository.StagingAerVerificationRepository;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerSaveApplicationVerificationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerVerificationImportThirdPartyDataRequestTaskActionPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class RequestAerApplyVerificationService {

    private final StagingAerVerificationRepository stagingAerVerificationRepository;
    private final DateService dateService;

    @Transactional
    public void applySaveAction(AerSaveApplicationVerificationRequestTaskActionPayload taskActionPayload,
                                RequestTask requestTask) {

        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
                (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();

        taskPayload.getVerificationReport().setVerificationData(taskActionPayload.getVerificationData());
        taskPayload.setVerificationSectionsCompleted(taskActionPayload.getVerificationSectionsCompleted());


        updateRequestPayload(requestTask);
    }

    @Transactional
    public void applyStagingData(RequestTask requestTask,
                                 AerVerificationImportThirdPartyDataRequestTaskActionPayload requestTaskActionPayload) {

        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
            (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();

        StagingAerVerificationEntity stagingAerVerificationEntity = stagingAerVerificationRepository
            .findByAccountIdAndYear(requestTask.getRequest().getAccountId(), taskPayload.getReportingYear())
            .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        StagingAerVerification stagingPayload = (StagingAerVerification) stagingAerVerificationEntity.getPayload();
        AerVerificationReport verificationReport = taskPayload.getVerificationReport();
        Boolean smfExists = taskPayload.getAer().getSmf().getExist();

        verificationReport.getVerificationData().setVerifierContact(stagingPayload.getVerifierContact());
        verificationReport.getVerificationData().setVerificationTeamDetails(stagingPayload.getVerificationTeamDetails());
        verificationReport.getVerificationData().setOpinionStatement(stagingPayload.getOpinionStatement());
        verificationReport.getVerificationData().setUncorrectedNonCompliances(stagingPayload.getUncorrectedNonCompliances());
        verificationReport.getVerificationData().setUncorrectedMisstatements(stagingPayload.getUncorrectedMisstatements());
        verificationReport.getVerificationData().setOverallDecision(stagingPayload.getOverallDecision());
        verificationReport.getVerificationData().setUncorrectedNonConformities(stagingPayload.getUncorrectedNonConformities());
        verificationReport.getVerificationData().setRecommendedImprovements(stagingPayload.getRecommendedImprovements());
        verificationReport.getVerificationData().setMaterialityLevel(stagingPayload.getMaterialityLevel());
        verificationReport.getVerificationData().setEtsComplianceRules(stagingPayload.getEtsComplianceRules());
        verificationReport.getVerificationData().setComplianceMonitoringReporting(stagingPayload.getComplianceMonitoringReporting());
        verificationReport.getVerificationData().setDataGapsMethodologies(stagingPayload.getDataGapsMethodologies());
        if (Boolean.TRUE.equals(smfExists)) {
            verificationReport.getVerificationData().setEmissionsReductionClaimVerification(
                stagingPayload.getEmissionsReductionClaimVerification());
        }

        stagingAerVerificationEntity.setImportedOn(dateService.getLocalDateTime());

        taskPayload.setVerificationSectionsCompleted(requestTaskActionPayload.getVerificationSectionsCompleted());
        updateRequestPayload(requestTask);
    }

    private void updateRequestPayload(RequestTask requestTask) {
        Request request = requestTask.getRequest();

        AerRequestPayload aerRequestPayload = ((AerRequestPayload) request.getPayload());
        AerApplicationVerificationSubmitRequestTaskPayload taskPayload =
            (AerApplicationVerificationSubmitRequestTaskPayload) requestTask.getPayload();

        aerRequestPayload.setVerificationReport(taskPayload.getVerificationReport());
        aerRequestPayload.getVerificationReport().setVerificationBodyId(request.getVerificationBodyId());
        aerRequestPayload.setVerificationSectionsCompleted(taskPayload.getVerificationSectionsCompleted());
    }
}
