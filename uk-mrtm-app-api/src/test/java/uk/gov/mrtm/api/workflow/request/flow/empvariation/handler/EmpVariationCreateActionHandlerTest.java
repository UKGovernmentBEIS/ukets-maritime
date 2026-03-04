package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestCreateActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.io.Serializable;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationCreateActionHandlerTest {
    private static final Long ACCOUNT_ID = 1L;
    private static final String TYPE = MrtmRequestType.EMP_VARIATION;
    private static final String USER_ID = "userId";

    @InjectMocks
    private EmpVariationCreateActionHandler handler;

    @Mock
    private StartProcessRequestService startProcessRequestService;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @ParameterizedTest
    @MethodSource("validScenarios")
    void process_regulator(String role, String regulatorAssignee, String operatorAssignee,
                           Map<String, Object> processVars) {
        RequestCreateActionEmptyPayload payload = RequestCreateActionEmptyPayload.builder().build();
        AppUser appUser = AppUser.builder()
            .roleType(role)
            .userId(USER_ID)
            .build();
        EmissionsMonitoringPlanContainer empContainer = mock(EmissionsMonitoringPlanContainer.class);
        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(ACCOUNT_ID))
            .thenReturn(Optional.ofNullable(
                EmissionsMonitoringPlanDTO
                    .builder()
                    .empContainer(empContainer)
                    .build())
            );

        RequestParams requestParams = RequestParams.builder()
            .type(TYPE)
            .requestResources(Map.of(ResourceType.ACCOUNT, ACCOUNT_ID.toString()))
            .requestPayload(EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .originalEmpContainer(empContainer)
                .regulatorAssignee(regulatorAssignee)
                .operatorAssignee(operatorAssignee)
                .build())
            .processVars(processVars)
            .requestMetadata(EmpVariationRequestMetadata.builder()
                .type(MrtmRequestMetadataType.EMP_VARIATION)
                .initiatorRoleType(role)
                .build())
            .build();

        when(startProcessRequestService.startProcess(requestParams))
            .thenReturn(Request.builder().id("1").build());
        String result = handler.process(ACCOUNT_ID, payload, appUser);

        assertThat(result).isEqualTo("1");
        verify(startProcessRequestService).startProcess(requestParams);
        verify(empQueryService).getEmissionsMonitoringPlanDTOByAccountId(ACCOUNT_ID);
        verifyNoMoreInteractions(startProcessRequestService, empQueryService);
    }

    public static Stream<Arguments> validScenarios() {
        Map<String, ? extends Serializable> regulatorProcessVars = Map.of(
            BpmnProcessConstants.REQUEST_INITIATOR_ROLE_TYPE, RoleTypeConstants.REGULATOR,
            BpmnProcessConstants.SKIP_PAYMENT, true
        );
        Map<String, ? extends Serializable> operatorProcessVars = Map.of(
            BpmnProcessConstants.REQUEST_INITIATOR_ROLE_TYPE, RoleTypeConstants.OPERATOR
        );
        return Stream.of(
            Arguments.of(RoleTypeConstants.REGULATOR, USER_ID, null, regulatorProcessVars),
            Arguments.of(RoleTypeConstants.OPERATOR, null, USER_ID, operatorProcessVars)
        );
    }

    @Test
    void process_regulator_throws_exception_invalid_role_type() {
        AppUser appUser = AppUser.builder()
            .roleType(RoleTypeConstants.VERIFIER)
            .userId(USER_ID)
            .build();
        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(ACCOUNT_ID))
            .thenReturn(Optional.ofNullable(
                EmissionsMonitoringPlanDTO
                    .builder()
                    .empContainer(EmissionsMonitoringPlanContainer.builder().build())
                    .build())
            );

        BusinessException exception = assertThrows(BusinessException.class,
            () -> handler.process(ACCOUNT_ID, null, appUser));

        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.REQUEST_CREATE_ACTION_NOT_ALLOWED);
        verify(empQueryService).getEmissionsMonitoringPlanDTOByAccountId(ACCOUNT_ID);
        verifyNoMoreInteractions(empQueryService);
        verifyNoInteractions(startProcessRequestService);
    }

    @Test
    void getType() {
        assertThat(handler.getRequestType()).isEqualTo(MrtmRequestType.EMP_VARIATION);
    }
}
