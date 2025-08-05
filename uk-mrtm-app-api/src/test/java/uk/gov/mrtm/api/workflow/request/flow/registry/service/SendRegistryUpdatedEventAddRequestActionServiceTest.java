package uk.gov.mrtm.api.workflow.request.flow.registry.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.integration.registry.emissionsupdated.domain.ReportableEmissionsUpdatedSubmittedEventDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.registry.domain.RegistryUpdatedEmissionsEventSubmittedRequestActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.integration.model.emission.AccountEmissionsUpdateEvent;

import java.time.Year;
import java.util.stream.Stream;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
class SendRegistryUpdatedEventAddRequestActionServiceTest {

    @InjectMocks
    private SendRegistryUpdatedEventAddRequestActionService service;

    @Mock
    private RequestService requestService;

    @ParameterizedTest
    @MethodSource("addRequestActionScenarios")
    void addRequestAction_is_notified_registry(boolean notifiedRegistry, int addActionToRequestInvocations) {
        Long registryId = 1234567L;
        Long reportableEmissions = 100L;
        Year reportingYear = Year.now();
        String userId = "userId";
        Request request = mock(Request.class);

        ReportableEmissionsUpdatedSubmittedEventDetails eventDetails = ReportableEmissionsUpdatedSubmittedEventDetails.builder()
            .notifiedRegistry(notifiedRegistry)
            .data(AccountEmissionsUpdateEvent.builder()
                .registryId(registryId)
                .reportingYear(reportingYear)
                .reportableEmissions(reportableEmissions)
                .build())
            .build();

        RegistryUpdatedEmissionsEventSubmittedRequestActionPayload requestActionPayload =
            RegistryUpdatedEmissionsEventSubmittedRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED_PAYLOAD)
                .registryId(registryId)
                .reportingYear(reportingYear)
                .reportableEmissions(reportableEmissions)
                .build();

        service.addRequestAction(request, eventDetails, userId);

        verify(requestService, times(addActionToRequestInvocations)).addActionToRequest(request,
            requestActionPayload,
            MrtmRequestActionType.REGISTRY_UPDATED_EMISSIONS_EVENT_SUBMITTED,
            userId);
        verifyNoMoreInteractions(requestService);
    }

    public static Stream<Arguments> addRequestActionScenarios() {
        return Stream.of(
            Arguments.of(false, 0),
            Arguments.of(true, 1)
        );
    }

}