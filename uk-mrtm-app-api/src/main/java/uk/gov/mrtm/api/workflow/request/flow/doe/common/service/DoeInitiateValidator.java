package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.common.service.RequestCreateAerRelatedValidator;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.time.Year;
import java.util.Set;

@Service
public class DoeInitiateValidator extends RequestCreateAerRelatedValidator {

    private final RequestCustomRepository requestCustomRepository;

    public DoeInitiateValidator(RequestCreateValidatorService requestCreateValidatorService,
                                RequestQueryService requestQueryService,
                                RequestCustomRepository requestCustomRepository) {
        super(requestCreateValidatorService, requestQueryService);
        this.requestCustomRepository = requestCustomRepository;
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
        return MrtmRequestType.DOE;
    }

    @Override
    protected RequestCreateRequestTypeValidationResult validateRequestType(Long accountId, RequestDetailsDTO requestDetailsDTO) {
        final RequestCreateRequestTypeValidationResult result = RequestCreateRequestTypeValidationResult.builder().valid(true).build();
        AerRequestMetadata metadata = (AerRequestMetadata) requestDetailsDTO.getRequestMetadata();
        if (metadata == null) {
            throw new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, requestDetailsDTO.getId());
        }
        if (!Year.now().isAfter(metadata.getYear())) {
            result.setValid(false);
            result.setReportedRequestTypes(Set.of(MrtmRequestType.DOE));
        }
        if (requestCustomRepository.findByRequestTypeAndResourceAndStatusAndYear(MrtmRequestType.DOE, ResourceType.ACCOUNT,
                accountId.toString(), Set.of(RequestStatuses.IN_PROGRESS), metadata.getYear().getValue()).isPresent()) {
            result.setValid(false);
            result.setReportedRequestTypes(Set.of(MrtmRequestType.DOE));
        }

        if (metadata.isExempted() || (!RequestStatuses.IN_PROGRESS.equals(requestDetailsDTO.getRequestStatus())
                && !RequestStatuses.COMPLETED.equals(requestDetailsDTO.getRequestStatus()))) {
            result.setValid(false);
            result.setReportedRequestTypes(Set.of(MrtmRequestType.DOE));
        }
        return result;
    }
}
