package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.time.Year;

@Service
@RequiredArgsConstructor
public class AerCreationService {

    private final StartProcessRequestService startProcessRequestService;
    private final AerCreationValidatorService aerCreationValidatorService;
    private final AerCreationRequestParamsBuilderService aerCreationRequestParamsBuilderService;

    public void createRequestAer(Long accountId, Year reportingYear) {

        // Validate if AER creation is allowed
        validateAccountStatus(accountId);
        validateReportingYearUniqueness(accountId, reportingYear);

        //create and start
        RequestParams requestParams = aerCreationRequestParamsBuilderService.buildRequestParams(accountId, reportingYear);
        startProcessRequestService.startProcess(requestParams);
    }

    private void validateAccountStatus(Long accountId) {
        RequestCreateValidationResult validationResult = aerCreationValidatorService.validateAccountStatus(accountId);
        if(!validationResult.isValid()) {
            throw new BusinessException(MrtmErrorCode.AER_CREATION_NOT_ALLOWED_INVALID_ACCOUNT_STATUS, validationResult);
        }
    }

    private void validateReportingYearUniqueness(Long accountId, Year reportingYear) {
        RequestCreateValidationResult validationResult =
            aerCreationValidatorService.validateReportingYear(accountId, reportingYear);
        if(!validationResult.isValid()) {
            throw new BusinessException(MrtmErrorCode.AER_ALREADY_EXISTS_FOR_REPORTING_YEAR, validationResult);
        }
    }
}