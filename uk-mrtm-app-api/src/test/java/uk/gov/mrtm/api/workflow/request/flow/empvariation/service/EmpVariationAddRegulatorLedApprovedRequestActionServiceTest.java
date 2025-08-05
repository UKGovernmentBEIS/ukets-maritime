package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationSubmitRegulatorLedMapper;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.List;
import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpVariationAddRegulatorLedApprovedRequestActionServiceTest {

    @InjectMocks
    private EmpVariationAddRegulatorLedApprovedRequestActionService cut;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Test
    void add() {
        String requestId = "RequestId";
        Long accountId = 1L;

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("op1"))
                .signatory("sign")
                .build();

        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .regulatorReviewer("reviewer")
                .decisionNotification(decisionNotification)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .operatorDetails(EmpOperatorDetails.builder()
                                .build())
                        .abbreviations(EmpAbbreviations.builder()
                                .exist(true)
                                .build())
                        .build())
                .build();

        Request request = Request.builder()
                .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
                .payload(requestPayload)
                .build();

        MrtmAccount accountInfo = MrtmAccount.builder()
                .id(accountId)
                .build();

        Map<String, RequestActionUserInfo> usersInfo = Map.of(
                "user1", RequestActionUserInfo.builder().name("username1").build()
        );

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(mrtmAccountQueryService.getAccountById(accountId)).thenReturn(accountInfo);
        when(requestActionUserInfoResolver.getUsersInfo(decisionNotification.getOperators(),
                decisionNotification.getSignatory(), request)).thenReturn(usersInfo);

        cut.add(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(mrtmAccountQueryService, times(1)).getAccountById(accountId);
        verify(requestActionUserInfoResolver, times(1)).getUsersInfo(decisionNotification.getOperators(),
                decisionNotification.getSignatory(), request);
        verify(requestService, times(1)).addActionToRequest(requestService.findRequestById(requestId),
                Mappers.getMapper(EmpVariationSubmitRegulatorLedMapper.class)
                        .toEmpVariationApplicationRegulatorLedApprovedRequestActionPayload(
                                requestPayload, accountInfo, usersInfo, requestPayload.getPayloadType()),
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED,
                "reviewer");

    }
}
