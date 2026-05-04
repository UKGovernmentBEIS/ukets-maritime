package uk.gov.mrtm.api.workflow.request.flow.registry.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeNotificationType;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryRegulatorNoticeEventSubmittedRequestActionPayload;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class RegulatorNoticeEventAddRequestActionService {

    private final RequestService requestService;

    public void addRequestAction(Request request,
                                 RegulatorNoticeSubmittedEventDetails eventDetails,
                                 FileInfoDTO officialNotice,
                                 MrtmRegulatorNoticeNotificationType notificationType) {

        if (!eventDetails.isNotifiedRegistry()) {
            return;
        }

        RegistryRegulatorNoticeEventSubmittedRequestActionPayload actionPayload =
            RegistryRegulatorNoticeEventSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.REGISTRY_REGULATOR_NOTICE_EVENT_SUBMITTED_PAYLOAD)
                .registryId(Integer.valueOf(eventDetails.getData().getRegistryId()))
                .officialNotice(officialNotice)
                .type(notificationType)
                .build();

        requestService.addActionToRequest(request, actionPayload,
            MrtmRequestActionType.REGISTRY_REGULATOR_NOTICE_EVENT_SUBMITTED, null);
    }
}
