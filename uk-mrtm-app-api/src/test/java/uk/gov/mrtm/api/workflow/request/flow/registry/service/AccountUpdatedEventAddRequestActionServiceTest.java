package uk.gov.mrtm.api.workflow.request.flow.registry.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryAccountUpdatedEventSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.UpdateOperatorDetails;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.integration.model.account.AccountUpdatingEvent;
import uk.gov.netz.integration.model.account.UpdateAccountDetailsMessage;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class AccountUpdatedEventAddRequestActionServiceTest {

    @InjectMocks
    private AccountUpdatedEventAddRequestActionService  service;

    @Mock
    private RequestService requestService;

    @Test
    void addRequestAction_is_not_notify_registry() {
        AccountUpdatedSubmittedEventDetails  eventDetails = AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(false)
            .build();

        service.addRequestAction(null, eventDetails, null, null);

        verifyNoInteractions(requestService);
    }

    @Test
    void addRequestAction_is_notify_registry() {
        String userId = "user-id";
        OrganisationStructure organisationStructure = mock(OrganisationStructure.class);
        Request request = mock(Request.class);
        AccountUpdatingEvent data = AccountUpdatingEvent.builder()
            .accountDetails(
                UpdateAccountDetailsMessage.builder()
                    .accountType("accountType")
                    .registryId("1234567")
                    .installationName("installationName")
                    .accountName("accountName")
                    .permitId("permitId")
                    .monitoringPlanId("monitoringPlanId")
                    .companyImoNumber("companyImoNumber")
                    .firstYearOfVerifiedEmissions(2025)
                    .build()
            )
            .build();

        AccountUpdatedSubmittedEventDetails  eventDetails = AccountUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(true)
            .data(data)
            .build();

        RegistryAccountUpdatedEventSubmittedRequestActionPayload requestActionPayload =
            RegistryAccountUpdatedEventSubmittedRequestActionPayload.builder()
                .accountDetails(UpdateOperatorDetails.builder()
                    .registryId(1234567)
                    .accountName("accountName")
                    .companyImoNumber("companyImoNumber")
                    .monitoringPlanId("monitoringPlanId")
                    .firstYearOfVerifiedEmissions(2025)
                    .build())
                .organisationStructure(organisationStructure)
                .payloadType(MrtmRequestActionPayloadType.REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED_PAYLOAD)
                .build();

        service.addRequestAction(request, eventDetails, organisationStructure, userId);

        verify(requestService).addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED,
            userId);

        verifyNoMoreInteractions(requestService);
    }
}