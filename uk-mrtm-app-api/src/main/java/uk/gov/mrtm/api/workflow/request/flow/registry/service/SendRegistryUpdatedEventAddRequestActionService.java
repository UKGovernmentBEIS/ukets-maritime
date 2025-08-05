package uk.gov.mrtm.api.workflow.request.flow.registry.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryUpdatedEmissionsEventSubmittedRequestActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class SendRegistryUpdatedEventAddRequestActionService {

    private final RequestService requestService;

    public void addRequestAction(Request request, ReportableEmissionsUpdatedSubmittedEventDetails eventDetails, String userId) {
        if (!eventDetails.isNotifiedRegistry()) {
            return;
        }

        RegistryUpdatedEmissionsEventSubmittedRequestActionPayload requestActionPayload =
            RegistryUpdatedEmissionsEventSubmittedRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED_PAYLOAD)
                .registryId(eventDetails.getData().getRegistryId())
                .reportingYear(eventDetails.getData().getReportingYear())
                .reportableEmissions(eventDetails.getData().getReportableEmissions())
                .build();

        requestService.addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED,
            userId);
    }
}
