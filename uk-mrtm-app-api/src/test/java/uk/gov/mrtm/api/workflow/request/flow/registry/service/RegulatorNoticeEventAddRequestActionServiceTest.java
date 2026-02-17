package uk.gov.mrtm.api.workflow.request.flow.registry.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeNotificationType;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.RegulatorNoticeSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryRegulatorNoticeEventSubmittedRequestActionPayload;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.integration.model.regulatornotice.RegulatorNoticeEvent;

import java.util.stream.Stream;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class RegulatorNoticeEventAddRequestActionServiceTest {

    @InjectMocks
    private RegulatorNoticeEventAddRequestActionService service;

    @Mock
    private RequestService requestService;

    @ParameterizedTest
    @MethodSource("addRequestActionScenarios")
    void addRequestAction_is_notified_registry(boolean notifiedRegistry, int addActionToRequestInvocations,
                                               MrtmRegulatorNoticeNotificationType notificationType) {
        String registryId = "1234567";
        FileInfoDTO officialNotice = mock(FileInfoDTO.class);
        Request request = mock(Request.class);

        RegulatorNoticeSubmittedEventDetails eventDetails = RegulatorNoticeSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(RegulatorNoticeEvent.builder()
                .registryId(registryId)
                .build())
            .build();

        RegistryRegulatorNoticeEventSubmittedRequestActionPayload requestActionPayload =
            RegistryRegulatorNoticeEventSubmittedRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.REGISTRY_REGULATOR_NOTICE_EVENT_SUBMITTED_PAYLOAD)
                .registryId(Integer.valueOf(registryId))
                .officialNotice(officialNotice)
                .type(notificationType)
                .build();

        service.addRequestAction(request, eventDetails, officialNotice, notificationType);

        verify(requestService, times(addActionToRequestInvocations)).addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.REGISTRY_REGULATOR_NOTICE_EVENT_SUBMITTED,
            null);
        verifyNoMoreInteractions(requestService);
    }

    public static Stream<Arguments> addRequestActionScenarios() {
        return Stream.of(
            Arguments.of(false, 0, MrtmRegulatorNoticeNotificationType.EMP_WITHDRAWN),
            Arguments.of(true, 1, MrtmRegulatorNoticeNotificationType.EMP_WITHDRAWN),
            Arguments.of(false, 0, MrtmRegulatorNoticeNotificationType.ACCOUNT_CLOSED),
            Arguments.of(true, 1, MrtmRegulatorNoticeNotificationType.ACCOUNT_CLOSED)
        );
    }


}