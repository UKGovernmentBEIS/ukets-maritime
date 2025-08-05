package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.DateOfNonSignificantChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotification;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmissionsMonitoringPlanNotificationContainer;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationDetailsOfChange;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowupRequiredChangesDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

@ExtendWith(MockitoExtension.class)
class EmpNotificationMapperTest {
    private final EmpNotificationMapper empNotificationMapper = Mappers.getMapper(EmpNotificationMapper.class);

    private static final UUID RANDOM_UUID = UUID.randomUUID();
    private static final String FILE_NAME = "file.txt";
    private static final LocalDate NOW = LocalDate.now();

    @Test
    void toEmpNotificationContainer() {
        EmpNotificationApplicationSubmitRequestTaskPayload payload = EmpNotificationApplicationSubmitRequestTaskPayload
                .builder()
                .emissionsMonitoringPlanNotification(createEmissionsMonitoringPlanNotification())
                .empNotificationAttachments(Map.of(RANDOM_UUID, FILE_NAME))
                .build();

        EmissionsMonitoringPlanNotificationContainer expectedResponse = EmissionsMonitoringPlanNotificationContainer
                .builder()
                .emissionsMonitoringPlanNotification(createEmissionsMonitoringPlanNotification())
                .empNotificationAttachments(Map.of(RANDOM_UUID, FILE_NAME))
                .build();

        EmissionsMonitoringPlanNotificationContainer actualResponse =
                empNotificationMapper.toEmpNotificationContainer(payload);

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void toApplicationSubmittedRequestActionPayload() {
        EmpNotificationApplicationSubmitRequestTaskPayload payload = EmpNotificationApplicationSubmitRequestTaskPayload
                .builder()
                .emissionsMonitoringPlanNotification(createEmissionsMonitoringPlanNotification())
                .empNotificationAttachments(Map.of(RANDOM_UUID, FILE_NAME))
                .build();

        EmpNotificationApplicationSubmittedRequestActionPayload expectedResponse = EmpNotificationApplicationSubmittedRequestActionPayload
                .builder()
                .emissionsMonitoringPlanNotification(createEmissionsMonitoringPlanNotification())
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_SUBMITTED_PAYLOAD)
                .build();

        EmpNotificationApplicationSubmittedRequestActionPayload actualResponse =
                empNotificationMapper.toApplicationSubmittedRequestActionPayload(payload);

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void toEmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload() {
        EmpNotificationRequestPayload payload = EmpNotificationRequestPayload
                .builder()
                .reviewDecision(createEmpNotificationReviewDecision())
                .reviewDecisionNotification(createReviewDecisionNotification())
                .payloadType("payloadType")
                .build();

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload expectedResponse = EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload
                .builder()
                .reviewDecision(createEmpNotificationReviewDecision())
                .reviewDecisionNotification(createReviewDecisionNotification())
                .payloadType("payloadType")
                .build();

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actualResponse =
                empNotificationMapper.toEmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload(payload, "payloadType");

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void toApplicationReviewRequestTaskPayload() {
        EmissionsMonitoringPlanNotification emissionsMonitoringPlanNotification =
                createEmissionsMonitoringPlanNotification();
        EmpNotificationReviewDecision empNotificationReviewDecision = createEmpNotificationReviewDecision();

        EmpNotificationRequestPayload payload = EmpNotificationRequestPayload
                .builder()
                .emissionsMonitoringPlanNotification(emissionsMonitoringPlanNotification)
                .reviewDecision(empNotificationReviewDecision)
                .reviewDecisionNotification(createReviewDecisionNotification())
                .empNotificationAttachments(Map.of(RANDOM_UUID, FILE_NAME))
                .payloadType("payloadType")
                .build();

        EmpNotificationApplicationReviewRequestTaskPayload expectedResponse = EmpNotificationApplicationReviewRequestTaskPayload
                .builder()
                .emissionsMonitoringPlanNotification(emissionsMonitoringPlanNotification)
                .empNotificationAttachments(Map.of(RANDOM_UUID, FILE_NAME))
                .reviewDecision(empNotificationReviewDecision)
                .payloadType("payloadType")
                .build();

        EmpNotificationApplicationReviewRequestTaskPayload actualResponse =
                empNotificationMapper.toApplicationReviewRequestTaskPayload(payload, "payloadType");

        assertEquals(expectedResponse, actualResponse);
    }

    @Test
    void cloneReturnedForAmendsIgnoreNotes() {

        final String payloadType = MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD;
        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload empNotificationFollowUpReturnedForAmendsRequestActionPayload =
                EmpNotificationFollowUpReturnedForAmendsRequestActionPayload.builder()
                        .payloadType(payloadType)
                        .decisionDetails(EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                                .notes("notes")
                                .requiredChanges(List.of(ReviewDecisionRequiredChange.builder()
                                        .reason("reason")
                                        .build()))
                                .dueDate(LocalDate.now())
                                .build())
                        .build();

        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload actualPayload =
                empNotificationMapper.cloneReturnedForAmendsIgnoreNotes(empNotificationFollowUpReturnedForAmendsRequestActionPayload, payloadType);

        assertEquals(actualPayload.getPayloadType(), payloadType);
        assertEquals("reason", actualPayload.getDecisionDetails().getRequiredChanges().get(0).getReason());
        assertNull(actualPayload.getDecisionDetails().getNotes());
    }

    @ParameterizedTest
    @MethodSource("cloneFollowUpReviewDecisionIgnoreNotesScenarios")
    void cloneFollowUpReviewDecisionIgnoreNotes(EmpNotificationFollowUpReviewDecision source,
                                                ReviewDecisionDetails expectedDetails) {
        EmpNotificationFollowUpReviewDecision actualResponse =
                empNotificationMapper.cloneFollowUpReviewDecisionIgnoreNotes(source);

        EmpNotificationFollowUpReviewDecision expectedResponse = EmpNotificationFollowUpReviewDecision.builder()
                .details(expectedDetails)
                .type(source.getType())
                .build();

        assertEquals(expectedResponse, actualResponse);
    }

    private static Stream<Arguments> cloneFollowUpReviewDecisionIgnoreNotesScenarios() {
        List<ReviewDecisionRequiredChange> details =
                List.of(ReviewDecisionRequiredChange.builder().reason("reason").build());
        EmpNotificationFollowUpReviewDecision amendsNeeded = EmpNotificationFollowUpReviewDecision.builder()
                .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                .details(EmpNotificationFollowupRequiredChangesDecisionDetails
                        .builder()
                        .dueDate(NOW)
                        .requiredChanges(details)
                        .build()
                )
                .build();

        EmpNotificationFollowUpReviewDecision accepted = EmpNotificationFollowUpReviewDecision.builder()
                .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
                .details(EmpNotificationFollowupRequiredChangesDecisionDetails
                        .builder()
                        .dueDate(NOW)
                        .requiredChanges(details)
                        .build()
                )
                .build();

        return Stream.of(
                Arguments.of(amendsNeeded,
                        EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                                .requiredChanges(details)
                                .dueDate(NOW)
                                .build()),
                Arguments.of(accepted, ReviewDecisionDetails.builder().build())
        );
    }

    @Test
    void cloneCompletedPayloadIgnoreNotes_ACCEPTED() {
        EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayload = EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD)
                .reviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                        .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
                        .details(ReviewDecisionDetails.builder()
                                .notes("notes")
                                .build())
                        .build())
                .build();
        EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadActual = empNotificationMapper
                .cloneCompletedPayloadIgnoreNotes(actionPayload, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD);

        assertNull(actionPayloadActual.getReviewDecision().getDetails().getNotes());
    }

    @Test
    void cloneCompletedPayloadIgnoreNotes_AMENDS_NEEDED() {
        LocalDate dueDate = LocalDate.now();
        EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayload = EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD)
                .reviewDecision(EmpNotificationFollowUpReviewDecision.builder()
                        .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
                        .details(EmpNotificationFollowupRequiredChangesDecisionDetails.builder()
                                .dueDate(dueDate)
                                .requiredChanges(List.of(ReviewDecisionRequiredChange.builder().reason("reason").build(),
                                        ReviewDecisionRequiredChange.builder().reason("reason2").build()))
                                .notes("notes")
                                .build())
                        .build())
                .build();
        EmpNotificationFollowUpApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadActual = empNotificationMapper
                .cloneCompletedPayloadIgnoreNotes(actionPayload, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_COMPLETED_PAYLOAD);

        assertEquals(((EmpNotificationFollowupRequiredChangesDecisionDetails)actionPayload.getReviewDecision().getDetails()).getDueDate(),
                ((EmpNotificationFollowupRequiredChangesDecisionDetails)actionPayloadActual.getReviewDecision().getDetails()).getDueDate());
        assertEquals(((EmpNotificationFollowupRequiredChangesDecisionDetails)actionPayload.getReviewDecision().getDetails()).getRequiredChanges(),
                ((EmpNotificationFollowupRequiredChangesDecisionDetails)actionPayloadActual.getReviewDecision().getDetails()).getRequiredChanges());
        assertNull(actionPayloadActual.getReviewDecision().getDetails().getNotes());
    }

    @Test
    void cloneReviewSubmittedPayloadIgnoreNotes_ACCEPTED() {
        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayload = EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_GRANTED_PAYLOAD)
                .reviewDecision(EmpNotificationReviewDecision.builder()
                        .type(EmpNotificationReviewDecisionType.ACCEPTED)
                        .details(EmpNotificationAcceptedDecisionDetails.builder()
                                .followUp(FollowUp.builder()
                                        .followUpResponseRequired(true)
                                        .followUpRequest("followUpRequest")
                                        .build())
                                .officialNotice("notice")
                                .notes("note")
                                .build())
                        .build())
                .officialNotice(FileInfoDTO.builder()
                        .name("name")
                        .uuid(UUID.randomUUID().toString())
                        .build())
                .build();

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadActual = empNotificationMapper
                .cloneReviewSubmittedPayloadIgnoreNotes(actionPayload, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_GRANTED_PAYLOAD);

        assertEquals(actionPayload.getOfficialNotice(), actionPayloadActual.getOfficialNotice());
        assertEquals(((EmpNotificationAcceptedDecisionDetails)actionPayload.getReviewDecision().getDetails()).getFollowUp(),
                ((EmpNotificationAcceptedDecisionDetails)actionPayloadActual.getReviewDecision().getDetails()).getFollowUp());

        assertNull(actionPayloadActual.getReviewDecision().getDetails().getNotes());
    }

    @Test
    void cloneReviewSubmittedPayloadIgnoreNotes_REJECTED() {
        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayload = EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload
                .builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_REJECTED_PAYLOAD)
                .reviewDecision(EmpNotificationReviewDecision.builder()
                        .type(EmpNotificationReviewDecisionType.REJECTED)
                        .details(EmpNotificationReviewDecisionDetails.builder()
                                .officialNotice("notice")
                                .notes("note")
                                .build())
                        .build())
                .officialNotice(FileInfoDTO.builder()
                        .name("name")
                        .uuid(UUID.randomUUID().toString())
                        .build())
                .build();

        EmpNotificationApplicationReviewSubmittedDecisionRequestActionPayload actionPayloadActual = empNotificationMapper
                .cloneReviewSubmittedPayloadIgnoreNotes(actionPayload, MrtmRequestActionPayloadType.EMP_NOTIFICATION_APPLICATION_REJECTED_PAYLOAD);

        assertEquals(actionPayload.getOfficialNotice(), actionPayloadActual.getOfficialNotice());
        assertNull(actionPayloadActual.getReviewDecision().getDetails().getNotes());
    }

    private static EmpNotificationReviewDecision createEmpNotificationReviewDecision() {
        return EmpNotificationReviewDecision.builder()
                .type(EmpNotificationReviewDecisionType.ACCEPTED)
                .details(
                        ReviewDecisionDetails
                                .builder()
                                .notes("notes")
                                .build()
                )
                .build();
    }

    private DecisionNotification createReviewDecisionNotification() {
        return DecisionNotification.builder()
                .operators(Set.of("operator"))
                .externalContacts(Set.of(1L))
                .signatory("signatory")
                .build();
    }

    private EmissionsMonitoringPlanNotification createEmissionsMonitoringPlanNotification() {
        return EmissionsMonitoringPlanNotification.builder()
                .detailsOfChange(EmpNotificationDetailsOfChange.builder()
                        .description("description")
                        .justification("justification")
                        .documents(Set.of(RANDOM_UUID))
                        .dateOfNonSignificantChange(DateOfNonSignificantChange.builder()
                                .startDate(LocalDate.now())
                                .endDate(LocalDate.now().plusDays(1))
                                .build())
                        .build())
                .build();
    }

}