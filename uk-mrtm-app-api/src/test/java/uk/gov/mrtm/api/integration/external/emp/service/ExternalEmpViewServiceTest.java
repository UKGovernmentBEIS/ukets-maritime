package uk.gov.mrtm.api.integration.external.emp.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.repository.MrtmAccountRepository;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlan;
import uk.gov.mrtm.api.integration.external.emp.domain.ExternalEmissionsMonitoringPlanDetails;
import uk.gov.mrtm.api.integration.external.emp.transform.ExternalEmpMapper;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.repository.RequestCustomRepository;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType.EMP_REISSUE;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType.EMP_VARIATION;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType.EMP_ISSUANCE;

@ExtendWith(MockitoExtension.class)
class ExternalEmpViewServiceTest {

    @InjectMocks
    private ExternalEmpViewService externalEmpViewService;

    @Mock
    private ExternalEmpMapper mapper;
    @Mock
    private MrtmAccountRepository mrtmAccountRepository;
    @Mock
    private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    @Mock
    private RequestCustomRepository requestCustomRepository;

    public static Stream<Arguments> getLatestEmissionsMonitoringPlanData_is_present() {
        LocalDateTime endDate = LocalDateTime.of(2026, 3, 25, 14, 0);
        LocalDateTime submissionDate = LocalDateTime.of(2026, 3, 15, 10, 30);

        return Stream.of(
            Arguments.of(EMP_VARIATION, EmpVariationRequestMetadata.builder()
                .summary("summary")
                .initiatorRoleType(RoleTypeConstants.OPERATOR)
                .build(), endDate, submissionDate, endDate, "summary"),
            Arguments.of(EMP_REISSUE, EmpReissueRequestMetadata.builder().summary("summary").build(), endDate, null, endDate, "summary"),
            Arguments.of(EMP_ISSUANCE, null, endDate, null, endDate, null),
            Arguments.of(EMP_VARIATION, EmpVariationRequestMetadata.builder()
                .summary("regulator-led summary")
                .initiatorRoleType(RoleTypeConstants.REGULATOR)
                .build(), endDate, submissionDate, submissionDate, "regulator-led summary"),
            Arguments.of(EMP_VARIATION, EmpVariationRequestMetadata.builder()
                .summary("regulator-led summary")
                .initiatorRoleType(RoleTypeConstants.REGULATOR)
                .build(), null, submissionDate, submissionDate, "regulator-led summary")
        );
    }

    @ParameterizedTest
    @MethodSource
    void getLatestEmissionsMonitoringPlanData_is_present(String requestTypeCode, RequestMetadata metadata,
        LocalDateTime endDate, LocalDateTime submissionDate, LocalDateTime expectedSubmissionDate, String comments) {
        Long accountId = 1234L;
        int consolidationNumber = 1;
        String companyImoNumber = "1234567";
        MrtmAccount account = MrtmAccount.builder().id(accountId).build();
        Request request = Request.builder()
            .type(RequestType.builder().code(requestTypeCode).build())
            .endDate(endDate)
            .submissionDate(submissionDate)
            .metadata(metadata)
            .build();
        EmissionsMonitoringPlan emissionsMonitoringPlan = mock(EmissionsMonitoringPlan.class);
        ExternalEmissionsMonitoringPlan data = mock(ExternalEmissionsMonitoringPlan.class);
        EmissionsMonitoringPlanDTO emissionsMonitoringPlanDTO = EmissionsMonitoringPlanDTO.builder()
            .empContainer(EmissionsMonitoringPlanContainer.builder().emissionsMonitoringPlan(emissionsMonitoringPlan).build())
            .consolidationNumber(consolidationNumber)
            .build();
        ExternalEmissionsMonitoringPlanDetails expected = ExternalEmissionsMonitoringPlanDetails.builder()
            .submissionDate(expectedSubmissionDate)
            .version(consolidationNumber)
            .comments(comments)
            .empData(data)
            .build();

        when(mrtmAccountRepository.findByImoNumber(companyImoNumber)).thenReturn(Optional.of(account));
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(Optional.of(emissionsMonitoringPlanDTO));
        when(mapper.toExternalEmissionsMonitoringPlan(emissionsMonitoringPlan)).thenReturn(data);
        when(requestCustomRepository.findLatestByRequestTypesAndResourceAndStatus(Set.of(EMP_ISSUANCE, MrtmRequestType.EMP_REISSUE, MrtmRequestType.EMP_VARIATION),
            ResourceType.ACCOUNT, account.getId().toString(),
            Set.of(EmpIssuanceDeterminationType.APPROVED.name(), RequestStatuses.COMPLETED))).thenReturn(request);

        ExternalEmissionsMonitoringPlanDetails actual = externalEmpViewService.getLatestEmissionsMonitoringPlanData(companyImoNumber);

        assertEquals(expected, actual);

        verify(mrtmAccountRepository).findByImoNumber(companyImoNumber);
        verify(emissionsMonitoringPlanQueryService).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verify(mapper).toExternalEmissionsMonitoringPlan(emissionsMonitoringPlan);
        verify(requestCustomRepository).findLatestByRequestTypesAndResourceAndStatus(Set.of(EMP_ISSUANCE, MrtmRequestType.EMP_REISSUE, MrtmRequestType.EMP_VARIATION),
            ResourceType.ACCOUNT, account.getId().toString(),
            Set.of(EmpIssuanceDeterminationType.APPROVED.name(), RequestStatuses.COMPLETED));

        verifyNoMoreInteractions(mrtmAccountRepository, emissionsMonitoringPlanQueryService, mapper, requestCustomRepository);
    }

    @Test
    void getLatestEmissionsMonitoringPlanData_is_not_present() {
        Long accountId = 1234L;
        String companyImoNumber = "1234567";
        MrtmAccount account = MrtmAccount.builder().id(accountId).build();

        when(mrtmAccountRepository.findByImoNumber(companyImoNumber)).thenReturn(Optional.of(account));
        when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId)).thenReturn(Optional.empty());

        BusinessException be = assertThrows(BusinessException.class,
            () -> externalEmpViewService.getLatestEmissionsMonitoringPlanData(companyImoNumber));

        assertEquals(MrtmErrorCode.EMP_NOT_FOUND, be.getErrorCode());

        verify(mrtmAccountRepository).findByImoNumber(companyImoNumber);
        verify(emissionsMonitoringPlanQueryService).getEmissionsMonitoringPlanDTOByAccountId(accountId);

        verifyNoMoreInteractions(mrtmAccountRepository, emissionsMonitoringPlanQueryService);
        verifyNoInteractions(mapper, requestCustomRepository);
    }
}
