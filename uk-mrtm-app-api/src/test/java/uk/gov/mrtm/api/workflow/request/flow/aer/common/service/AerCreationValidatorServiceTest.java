package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerCreationValidatorServiceTest {

    @InjectMocks
    private AerCreationValidatorService validatorService;

    @Mock
    private RequestCreateValidatorService requestCreateValidatorService;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private AerRequestIdGenerator aerRequestIdGenerator;

    @Test
    void validateAccountStatus() {
        Long accountId = 1L;
        Set<AccountStatus> accountStatuses = Set.of(
            MrtmAccountStatus.NEW,
            MrtmAccountStatus.LIVE,
            MrtmAccountStatus.WITHDRAWN);
        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        when(requestCreateValidatorService.validate(accountId, accountStatuses, Set.of())).thenReturn(validationResult);

        assertEquals(validationResult, validatorService.validateAccountStatus(accountId));

        verify(requestCreateValidatorService, times(1)).validate(accountId, accountStatuses, Set.of());
    }

    @Test
    void validateReportingYear() {
        Long accountId = 1L;
        Year reportingYear = Year.of(2023);
        String requestId = "REQ-ID-1";

        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(reportingYear).build())
            .build();

        when(aerRequestIdGenerator.generate(params)).thenReturn(requestId);
        when(requestQueryService.existsRequestById(requestId)).thenReturn(false);

        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(true).build();

        assertEquals(validationResult, validatorService.validateReportingYear(accountId, reportingYear));
    }

    @Test
    void validateReportingYear_is_invalid() {
        Long accountId = 1L;
        Year reportingYear = Year.of(2023);
        String requestId = "REQ-ID-1";

        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .requestMetadata(AerRequestMetadata.builder().type(MrtmRequestMetadataType.AER).year(reportingYear).build())
            .build();

        when(aerRequestIdGenerator.generate(params)).thenReturn(requestId);
        when(requestQueryService.existsRequestById(requestId)).thenReturn(true);

        RequestCreateValidationResult validationResult = RequestCreateValidationResult.builder().valid(false).build();

        assertEquals(validationResult, validatorService.validateReportingYear(accountId, reportingYear));
    }
}