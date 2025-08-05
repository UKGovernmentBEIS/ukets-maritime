package uk.gov.mrtm.api.workflow.request.flow.common.service;

import lombok.RequiredArgsConstructor;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReportRelatedRequestCreateActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateAccountStatusValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateRequestTypeValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateByRequestValidator;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
public abstract class RequestCreateAerRelatedValidator implements RequestCreateByRequestValidator<ReportRelatedRequestCreateActionPayload> {

    protected final RequestCreateValidatorService requestCreateValidatorService;
    protected final RequestQueryService requestQueryService;

    @Override
    public RequestCreateValidationResult validateAction(final Long accountId, ReportRelatedRequestCreateActionPayload payload) {
        RequestDetailsDTO requestDetailsDTO = requestQueryService.findRequestDetailsById(payload.getRequestId());

        if (!Objects.equals(requestDetailsDTO.getRequestType(), this.getReferableRequestType())) {
            throw new BusinessException(MrtmErrorCode.AER_REQUEST_IS_NOT_AER, payload.getRequestId());
        }

        final RequestCreateValidationResult overallValidationResult = RequestCreateValidationResult.builder().valid(true).build();

        RequestCreateAccountStatusValidationResult accountStatusValidationResult = requestCreateValidatorService
                .validateAccountStatuses(accountId, this.getApplicableAccountStatuses());
        if (!accountStatusValidationResult.isValid()) {
            overallValidationResult.setValid(false);
            overallValidationResult.setReportedAccountStatus(accountStatusValidationResult.getReportedAccountStatus());
            overallValidationResult.setApplicableAccountStatuses(this.getApplicableAccountStatuses()
                    .stream().map(AccountStatus::getName)
                    .collect(Collectors.toSet())
            );
        }

        RequestCreateRequestTypeValidationResult requestTypeValidationResult = this.validateRequestType(accountId, requestDetailsDTO);
        if (!requestTypeValidationResult.isValid()) {
            overallValidationResult.setValid(false);
            overallValidationResult.setReportedRequestTypes(requestTypeValidationResult.getReportedRequestTypes());
        }

        return overallValidationResult;
    }

    protected abstract RequestCreateRequestTypeValidationResult validateRequestType(Long accountId, RequestDetailsDTO requestDetailsDTO);

    protected abstract Set<AccountStatus> getApplicableAccountStatuses();

    protected abstract String getReferableRequestType();
}
