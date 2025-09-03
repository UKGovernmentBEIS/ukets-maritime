package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.RequestCreateAerRelatedValidator;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Objects;
import java.util.Set;

@Service
public class AerReInitiateValidator extends RequestCreateAerRelatedValidator {

    public AerReInitiateValidator(RequestCreateValidatorService requestCreateValidatorService, RequestQueryService requestQueryService) {
        super(requestCreateValidatorService, requestQueryService);
    }

    @Override
    protected Set<AccountStatus> getApplicableAccountStatuses() {
        return Set.of(
                MrtmAccountStatus.NEW,
                MrtmAccountStatus.LIVE,
                MrtmAccountStatus.WITHDRAWN);
    }

    @Override
    protected String getReferableRequestType() {
        return MrtmRequestType.AER;
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.AER;
    }

    @Override
    protected RequestCreateRequestTypeValidationResult validateRequestType(Long accountId, RequestDetailsDTO requestDetailsDTO) {
        final RequestCreateRequestTypeValidationResult result = RequestCreateRequestTypeValidationResult.builder().valid(true).build();
        if (!Objects.equals(requestDetailsDTO.getRequestStatus(), RequestStatuses.COMPLETED)) {
            result.setValid(false);
            result.setReportedRequestTypes(Set.of(MrtmRequestType.AER));
        }
        return result;
    }
}
