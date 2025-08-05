package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationWaitForFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.time.LocalDate;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class EmpNotificationWaitForFollowUpInitializerTest {

    @InjectMocks
    private EmpNotificationWaitForFollowUpInitializer initializer;

    @Test
    void initializePayload() {

        final EmpNotificationReviewDecision reviewDecision = EmpNotificationReviewDecision.builder()
                .details(
                        EmpNotificationAcceptedDecisionDetails.builder()
                                .officialNotice("officialNotice")
                                .followUp(FollowUp.builder()
                                        .followUpRequest("the request")
                                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                                        .build())
                                .build()
                )
                .build();

        final Request request = Request.builder()
                .type(RequestType.builder().code(MrtmRequestType.EMP_NOTIFICATION).build())
                .payload(EmpNotificationRequestPayload.builder()
                        .reviewDecision(reviewDecision)
                        .build())
                .build();

        final EmpNotificationWaitForFollowUpRequestTaskPayload expected =
                EmpNotificationWaitForFollowUpRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_WAIT_FOR_FOLLOW_UP_PAYLOAD)
                        .followUpRequest("the request")
                        .followUpResponseExpirationDate(LocalDate.of(2023, 1, 1))
                        .build();

        RequestTaskPayload actual = initializer.initializePayload(request);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
                .isEqualTo(Set.of(MrtmRequestTaskType.EMP_NOTIFICATION_WAIT_FOR_FOLLOW_UP));
    }
}
