package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeAddSubmittedRequestActionServiceTest {

    @InjectMocks
    private DoeAddSubmittedRequestActionService service;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestActionUserInfoResolver requestActionUserInfoResolver;

    @Mock
    private RequestAccountContactQueryService requestAccountContactQueryService;

    @Test
    void add_when_primary_contact_exists() {
        String requestId = "1";

        Doe doe = Doe.builder().maritimeEmissions(DoeMaritimeEmissions.builder().determinationReason(DoeDeterminationReason.builder()
                        .furtherDetails("details")
                        .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                        .build())
                    .build())
                .build();

        DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator1", "operator2"))
                .signatory("signatory")
                .build();
        Map<String, RequestActionUserInfo> usersInfo = Map.of(
                "operator1", RequestActionUserInfo.builder().name("operator1UserName").build(),
                "operator2", RequestActionUserInfo.builder().name("operator2UserName").build(),
                "signatory", RequestActionUserInfo.builder().name("regulatorUserName").build()
        );

        DoeRequestPayload payload = DoeRequestPayload.builder()
                .regulatorAssignee("regulator")
                .doe(doe)
                .decisionNotification(decisionNotification)
                .build();
        final Request request = Request.builder()
                .id(requestId)
                .payload(payload)
                .build();
        UserInfoDTO accountPrimaryContact = UserInfoDTO.builder().userId("primaryContact").build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.of(accountPrimaryContact));
        when(requestActionUserInfoResolver.getUsersInfo(Set.of("operator1", "operator2"), "signatory", request)).thenReturn(usersInfo);

        service.add(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestService, times(1)).addActionToRequest(request,
                DoeApplicationSubmittedRequestActionPayload.builder()
                        .doe(doe)
                        .decisionNotification(decisionNotification)
                        .payloadType(MrtmRequestActionPayloadType.DOE_APPLICATION_SUBMITTED_PAYLOAD)
                        .usersInfo(usersInfo)
                        .build(),
                MrtmRequestActionType.DOE_APPLICATION_SUBMITTED,
                "regulator");
    }

    @Test
    void add_when_primary_contact_not_exists() {
        String requestId = "1";

        Doe doe = Doe.builder().maritimeEmissions(
                            DoeMaritimeEmissions.builder()
                                    .determinationReason(DoeDeterminationReason.builder()
                                    .furtherDetails("details")
                                    .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                                    .build())
                        .build())
                .build();

        String signatory = "signatory";
        DecisionNotification decisionNotification = DecisionNotification.builder()
            .signatory(signatory)
            .build();
        RequestActionUserInfo signatoryUserInfo = RequestActionUserInfo.builder().name("signatoryName").build();

        DoeRequestPayload payload = DoeRequestPayload.builder()
                .regulatorAssignee("regulator")
                .doe(doe)
                .decisionNotification(decisionNotification)
                .build();
        final Request request = Request.builder()
            .id(requestId)
            .payload(payload)
            .build();

        when(requestService.findRequestById(requestId)).thenReturn(request);
        when(requestAccountContactQueryService.getRequestAccountPrimaryContact(request)).thenReturn(Optional.empty());
        when(requestActionUserInfoResolver.getSignatoryUserInfo(signatory)).thenReturn(signatoryUserInfo);

        service.add(requestId);

        verify(requestService, times(1)).findRequestById(requestId);
        verify(requestService, times(1)).addActionToRequest(request,
                DoeApplicationSubmittedRequestActionPayload.builder()
                        .doe(doe)
                        .decisionNotification(decisionNotification)
                        .payloadType(MrtmRequestActionPayloadType.DOE_APPLICATION_SUBMITTED_PAYLOAD)
                        .usersInfo(Map.of("signatory", signatoryUserInfo))
                        .build(),
                MrtmRequestActionType.DOE_APPLICATION_SUBMITTED,
                "regulator");
    }
}
