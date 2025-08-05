package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.account.domain.enumeration.AccountStatus;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateValidatorService;

import java.time.Year;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AerCreationValidatorService {

    private final RequestCreateValidatorService requestCreateValidatorService;
    private final RequestQueryService requestQueryService;
    private final AerRequestIdGenerator aerRequestIdGenerator;

    @Transactional
    public RequestCreateValidationResult validateAccountStatus(Long accountId) {
        Set<AccountStatus> applicableAccountStatuses = Set.of(
            MrtmAccountStatus.NEW,
            MrtmAccountStatus.LIVE,
            MrtmAccountStatus.WITHDRAWN);
        return requestCreateValidatorService.validate(accountId, applicableAccountStatuses, Set.of());
    }

    @Transactional
    public RequestCreateValidationResult validateReportingYear(Long accountId, Year year) {
        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        // Validate AERs with same year
        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(year).build())
            .build();
        String requestId = aerRequestIdGenerator.generate(params);
        boolean aerExists = requestQueryService.existsRequestById(requestId);

        if (aerExists) {
            validationResult.setValid(false);
        }

        return validationResult;
    }
}
