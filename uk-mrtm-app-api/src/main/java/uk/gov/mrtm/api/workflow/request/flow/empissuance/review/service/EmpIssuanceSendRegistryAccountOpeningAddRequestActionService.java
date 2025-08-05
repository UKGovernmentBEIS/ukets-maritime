package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpIssuanceSendRegistryAccountOpeningAddRequestActionService {

    private final RequestService requestService;
    private final MrtmAccountQueryService mrtmAccountQueryService;

    public void addRequestAction(Request request, OrganisationStructure organisationStructure, String userId) {
        MrtmAccount account = mrtmAccountQueryService.getAccountById(request.getAccountId());

        EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload requestActionPayload =
            EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED_PAYLOAD)
                .businessId(account.getBusinessId())
                .imoNumber(account.getImoNumber())
                .name(account.getName())
                .firstMaritimeActivityDate(account.getFirstMaritimeActivityDate())
                .competentAuthority(account.getCompetentAuthority())
                .organisationStructure(organisationStructure)
                .build();

        requestService.addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.EMP_ISSUANCE_REGISTRY_ACCOUNT_OPENING_EVENT_SUBMITTED,
            userId);
    }
}
