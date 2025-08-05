package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
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
public class EmpVariationApprovedAddRequestActionServiceTest {

    @InjectMocks
    private EmpVariationApprovedAddRequestActionService addRequestActionService;

    @Mock
    private RequestService requestService;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Test
    void addRequestAction() {
        String requestId = "1L";
        Long accountId = 1L;
        String regulatorUser = "regulatorUser";
        Set<String> operatorsNotified = Set.of("operatorUser");
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder().build())
                .build();
        EmpVariationDetermination determination = EmpVariationDetermination.builder().type(EmpVariationDeterminationType.APPROVED).build();
        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(operatorsNotified)
                .signatory(regulatorUser)
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(EmpVariationDetails.builder().reason("test reason").build())
                .determination(determination)
                .decisionNotification(decisionNotification)
                .regulatorReviewer(regulatorUser)
                .build();
        Request request = Request.builder().id(requestId).requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).payload(requestPayload).build();
        MrtmAccount mrtmAccountInfo = MrtmAccount.builder()
                .name("operatorName")
                .imoNumber("imoNumber")
                .build();
        Map<String, RequestActionUserInfo> usersInfo = Map.of(
                "operatorUser", RequestActionUserInfo.builder().name("operatorUserName").build(),
                "regulatorUser", RequestActionUserInfo.builder().name("regulatorUserName").build()
        );

        EmpOperatorDetails operatorDetails = emp.getOperatorDetails();
        operatorDetails.setImoNumber(mrtmAccountInfo.getImoNumber());
        EmpVariationApplicationApprovedRequestActionPayload requestActionPayload = EmpVariationApplicationApprovedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_APPROVED_PAYLOAD)
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(EmpVariationDetails.builder().reason("test reason").build())
                .determination(determination)
                .decisionNotification(decisionNotification)
                .usersInfo(usersInfo)
                .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(mrtmAccountQueryService.getAccountById(accountId)).thenReturn(mrtmAccountInfo);
        when(requestActionUserInfoResolver.getUsersInfo(operatorsNotified, regulatorUser, request)).thenReturn(usersInfo);

        //invoke
        addRequestActionService.addRequestAction(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(mrtmAccountQueryService, times(1)).getAccountById(accountId);
        verify(requestActionUserInfoResolver, times(1)).getUsersInfo(operatorsNotified, regulatorUser, request);
        verify(requestService, times(1))
                .addActionToRequest(request, requestActionPayload,  MrtmRequestActionType.EMP_VARIATION_APPLICATION_APPROVED, regulatorUser);
    }
}
