package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.account.service.MrtmAccountUpdateService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
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
public class EmpIssuanceDeemedWithdrawnAddRequestActionServiceTest {

    @InjectMocks
    private EmpIssuanceDeemedWithdrawnAddRequestActionService addRequestActionService;

    @Mock
    private RequestService requestService;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;                                  

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Mock
    private MrtmAccountUpdateService accountUpdateService;

    @Test
    void addRequestAction() {
        String requestId = "1L";
        Long accountId = 1L;
        Set<String> operatorsNotified = Set.of("operatorUser");
        String regulatorUser = "regulatorUser";
        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(operatorsNotified)
                .signatory(regulatorUser)
                .build();
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder().type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN).build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .decisionNotification(decisionNotification)
                .determination(determination)
                .regulatorReviewer(regulatorUser)
                .build();
        Request request = Request.builder().id(requestId).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId))
            .resourceType(ResourceType.ACCOUNT).build())).payload(requestPayload).build();
        Map<String, RequestActionUserInfo> usersInfo = Map.of(
                "operatorUser", RequestActionUserInfo.builder().name("operatorUserName").build(),
                "regulatorUser", RequestActionUserInfo.builder().name("regulatorUserName").build()
        );

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestActionUserInfoResolver.getUsersInfo(operatorsNotified, regulatorUser, request)).thenReturn(usersInfo);
        
        //invoke
        addRequestActionService.addRequestAction(requestId);
        
        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestActionUserInfoResolver, times(1)).getUsersInfo(operatorsNotified, regulatorUser, request);
        verify(accountUpdateService, times (1)).updateAccountUponEmpWithdrawn(accountId);

        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload requestActionPayload = EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_DEEMED_WITHDRAWN_PAYLOAD)
                .decisionNotification(decisionNotification)
                .determination(determination)
                .usersInfo(usersInfo)
                .build();

        verify(requestService, times(1))
                .addActionToRequest(request, requestActionPayload,  MrtmRequestActionType.EMP_ISSUANCE_APPLICATION_DEEMED_WITHDRAWN, regulatorUser);
    }
}
