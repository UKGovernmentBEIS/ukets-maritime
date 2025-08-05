package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.reporting.service.AerService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirCreationService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadataReportable;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerCreateVirService {

    private final RequestService requestService;
    private final VirCreationService virCreationService;
    private final RequestCreateValidatorService requestCreateValidatorService;
    private final AerService aerService;

    @Transactional
    public void createRequestVir(final String requestId) {

        final Request request = requestService.findRequestById(requestId);
        final AerRequestPayload requestPayload = (AerRequestPayload) request.getPayload();
        final RequestMetadataReportable aerRequestMetadata = (RequestMetadataReportable) request.getMetadata();

        // Triggered ONLY at 1st Operator submission of verified AER to Regulator
        if (!requestPayload.isVirTriggered() &&
            requestPayload.isVerificationPerformed() &&
            this.isValidForVir(request.getAccountId(), requestPayload) &&
            !aerService.existsAerByAccountIdAndYear(request.getAccountId(), aerRequestMetadata.getYear())) {
            virCreationService.createRequestVir(requestId, request.getAccountId());
            requestPayload.setVirTriggered(true);
        }
    }

    private boolean isValidForVir(final long accountId, final AerRequestPayload aerRequestPayload) {

        // VIR is triggered only for new and live accounts
        final RequestCreateAccountStatusValidationResult validationAccountStatusResult =
            requestCreateValidatorService.validateAccountStatuses(
                accountId, 
                Set.of(MrtmAccountStatus.NEW, MrtmAccountStatus.LIVE)
            );
        if (!validationAccountStatusResult.isValid()) {
            return false;
        }

        // Check if data applicable for VIR
        return aerRequestPayload.getVerificationData().isValidForVir();
    }
}
