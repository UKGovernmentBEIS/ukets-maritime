package uk.gov.mrtm.api.workflow.request.flow.registry.service;


import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.integration.registry.accountupdated.domain.AccountUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryAccountUpdatedEventSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.registry.transform.AccountUpdatedRequestActionMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class AccountUpdatedEventAddRequestActionService {

    private final AccountUpdatedRequestActionMapper mapper = Mappers.getMapper(AccountUpdatedRequestActionMapper.class);

    private final RequestService requestService;

    public void addRequestAction(Request request, AccountUpdatedSubmittedEventDetails eventDetails,
                                 OrganisationStructure organisationStructure, String userId) {
        if (!eventDetails.isNotifiedRegistry()) {
            return;
        }

        RegistryAccountUpdatedEventSubmittedRequestActionPayload requestActionPayload = mapper.map(
            eventDetails.getData(),
            organisationStructure,
            MrtmRequestActionPayloadType.REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.REGISTRY_UPDATED_ACCOUNT_EVENT_SUBMITTED,
            userId);
    }
}
