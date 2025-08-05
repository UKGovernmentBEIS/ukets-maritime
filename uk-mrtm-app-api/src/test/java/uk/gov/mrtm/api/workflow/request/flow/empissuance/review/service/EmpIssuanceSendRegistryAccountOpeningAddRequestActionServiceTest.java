package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;


import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceSendRegistryAccountOpeningAddRequestActionServiceTest {

    @InjectMocks
    private EmpIssuanceSendRegistryAccountOpeningAddRequestActionService requestActionService;

    @Mock
    private RequestService requestService;
    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Test
    void addRequestAction() {
        String userId = "user-id";
        MrtmAccount account = MrtmAccount
            .builder()
            .businessId("business-id")
            .imoNumber("1234567")
            .name("name")
            .firstMaritimeActivityDate(LocalDate.of(2025, 4, 8))
            .competentAuthority(CompetentAuthorityEnum.ENGLAND)
            .build();

        long accountId = 2L;
        Request request = Request.builder().id("id").requestResources(
                List.of(
                    RequestResource.builder()
                        .resourceId(String.valueOf(accountId))
                        .resourceType(ResourceType.ACCOUNT)
                        .build())
            )
            .payload(EmpIssuanceRequestPayload.builder().accountOpeningEventSentToRegistry(true).build())
            .build();
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(UUID.randomUUID(), "1234567");

        EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload requestActionPayload =
            EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED_PAYLOAD)
                .businessId(account.getBusinessId())
                .imoNumber(account.getImoNumber())
                .name(account.getName())
                .firstMaritimeActivityDate(account.getFirstMaritimeActivityDate())
                .competentAuthority(account.getCompetentAuthority())
                .organisationStructure(emissionsMonitoringPlan.getOperatorDetails().getOrganisationStructure())
                .build();

        when(mrtmAccountQueryService.getAccountById(accountId)).thenReturn(account);

        requestActionService.addRequestAction(request,
            emissionsMonitoringPlan.getOperatorDetails().getOrganisationStructure(),
            userId);

        verify(requestService).addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED,
            userId);
        verify(mrtmAccountQueryService).getAccountById(accountId);

        verifyNoMoreInteractions(requestService, mrtmAccountQueryService);
    }
}