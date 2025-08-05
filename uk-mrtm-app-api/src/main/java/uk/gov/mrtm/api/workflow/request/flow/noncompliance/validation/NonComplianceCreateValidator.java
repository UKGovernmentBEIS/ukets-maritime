package uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateAccountRelatedValidator;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Set;

@Service
public class NonComplianceCreateValidator extends RequestCreateAccountRelatedValidator {

    public NonComplianceCreateValidator(final RequestCreateValidatorService requestCreateValidatorService) {
        super(requestCreateValidatorService);
    }

    @Override
    protected Set<AccountStatus> getApplicableAccountStatuses() {
        return Set.of(MrtmAccountStatus.NEW, MrtmAccountStatus.LIVE, MrtmAccountStatus.WITHDRAWN);
    }

    @Override
    protected Set<String> getMutuallyExclusiveRequests() {
        return Set.of();
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.NON_COMPLIANCE;
    }
}
