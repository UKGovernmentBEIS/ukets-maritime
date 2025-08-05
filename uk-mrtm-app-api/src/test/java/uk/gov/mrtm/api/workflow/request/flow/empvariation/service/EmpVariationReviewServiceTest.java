package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpVariationReviewServiceTest {

    @InjectMocks
    private EmpVariationReviewService service;

    @Test
    void saveEmpVariation() {
        EmpVariationSaveApplicationReviewRequestTaskActionPayload taskActionPayload = EmpVariationSaveApplicationReviewRequestTaskActionPayload.builder()
                .empVariationDetails(EmpVariationDetails.builder()
                        .reason("test reason")
                        .build())
                .empVariationDetailsCompleted("true")
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .abbreviations(EmpAbbreviations.builder().exist(false).build())
                        .operatorDetails(EmpOperatorDetails.builder().build())
                        .build())
                .empSectionsCompleted(Map.of("a", "b"))
                .build();

        EmpVariationApplicationReviewRequestTaskPayload taskPayload = EmpVariationApplicationReviewRequestTaskPayload
                .builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .operatorDetails(EmpOperatorDetails.builder().build())
                        .build())
                .build();
        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .build();

        service.saveEmpVariation(taskActionPayload, requestTask);

        assertThat(taskPayload.getEmpVariationDetails()).isEqualTo(taskActionPayload.getEmpVariationDetails());
        assertThat(taskPayload.getEmpVariationDetailsCompleted()).isEqualTo(taskActionPayload.getEmpVariationDetailsCompleted());
        assertThat(taskPayload.getEmissionsMonitoringPlan()).isEqualTo(taskActionPayload.getEmissionsMonitoringPlan());
        assertThat(taskPayload.getEmpVariationDetailsReviewCompleted()).isEqualTo(taskActionPayload.getEmpVariationDetailsReviewCompleted());
        assertThat(taskPayload.getEmpSectionsCompleted()).isEqualTo(taskActionPayload.getEmpSectionsCompleted());
    }

    @Test
    void saveEmpVariation_rejected() {
        EmpVariationSaveApplicationReviewRequestTaskActionPayload taskActionPayload = EmpVariationSaveApplicationReviewRequestTaskActionPayload.builder()
                .empVariationDetails(EmpVariationDetails.builder()
                        .reason("test reason")
                        .build())
                .empVariationDetailsCompleted("true")
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .abbreviations(EmpAbbreviations.builder().exist(false).build())
                        .operatorDetails(EmpOperatorDetails.builder().build())
                        .build())
                .empSectionsCompleted(Map.of("a", "b"))
                .build();

        EmpVariationApplicationReviewRequestTaskPayload taskPayload = EmpVariationApplicationReviewRequestTaskPayload
                .builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan
                        .builder()
                        .operatorDetails(EmpOperatorDetails.builder().build())
                        .build())
                .determination(EmpVariationDetermination.builder()
                        .type(EmpVariationDeterminationType.REJECTED)
                        .reason("reason")
                        .build())
                .build();
        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .build();

        service.saveEmpVariation(taskActionPayload, requestTask);

        assertThat(taskPayload.getEmpVariationDetails()).isEqualTo(taskActionPayload.getEmpVariationDetails());
        assertThat(taskPayload.getEmpVariationDetailsCompleted()).isEqualTo(taskActionPayload.getEmpVariationDetailsCompleted());
        assertThat(taskPayload.getEmissionsMonitoringPlan()).isEqualTo(taskActionPayload.getEmissionsMonitoringPlan());
        assertThat(taskPayload.getEmpVariationDetailsReviewCompleted()).isEqualTo(taskActionPayload.getEmpVariationDetailsReviewCompleted());
        assertThat(taskPayload.getEmpSectionsCompleted()).isEqualTo(taskActionPayload.getEmpSectionsCompleted());
        assertThat(taskPayload.getDetermination()).isNull();
    }

    @Test
    void saveReviewGroupDecision() {
        EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload = EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                .decision(
                        EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.ACCEPTED)
                                .details(EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("test notes")
                                        .variationScheduleItems(List.of("change1", "change2"))
                                        .build())
                                .build()
                )
                .empSectionsCompleted(Map.of("section1", "completed"))
                .group(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                .build();

        EmpVariationApplicationReviewRequestTaskPayload taskPayload = EmpVariationApplicationReviewRequestTaskPayload
                .builder()
                .determination(EmpVariationDetermination.builder().type(EmpVariationDeterminationType.APPROVED).build())
                .build();
        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .build();


        service.saveReviewGroupDecision(taskActionPayload, requestTask);

        assertThat(taskPayload.getEmpVariationDetailsReviewDecision()).isNull();
        assertThat(taskPayload.getEmpSectionsCompleted()).isEqualTo(taskActionPayload.getEmpSectionsCompleted());
        assertThat(taskPayload.getReviewGroupDecisions()).containsValue(taskActionPayload.getDecision());
        assertThat(taskPayload.getDetermination()).isNull();
    }


    @Test
    void saveReviewGroupDecision_withdrawn_determination() {
        EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload taskActionPayload = EmpVariationSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                .decision(
                        EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.ACCEPTED)
                                .details(EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("test notes")
                                        .variationScheduleItems(List.of("change1", "change2"))
                                        .build())
                                .build()
                )
                .empSectionsCompleted(Map.of("section1", "completed"))
                .group(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                .build();

        EmpVariationApplicationReviewRequestTaskPayload taskPayload = EmpVariationApplicationReviewRequestTaskPayload
                .builder()
                .determination(EmpVariationDetermination.builder().type(EmpVariationDeterminationType.DEEMED_WITHDRAWN).build())
                .build();
        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .build();

        service.saveReviewGroupDecision(taskActionPayload, requestTask);

        assertThat(taskPayload.getEmpVariationDetailsReviewDecision()).isNull();
        assertThat(taskPayload.getEmpSectionsCompleted()).isEqualTo(taskActionPayload.getEmpSectionsCompleted());
        assertThat(taskPayload.getReviewGroupDecisions()).containsValue(taskActionPayload.getDecision());
        assertThat(taskPayload.getDetermination()).isNotNull();
    }

    @Test
    void saveReviewGroupDetailsDecision() {
        EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload taskActionPayload = EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload.builder()
                .decision(
                        EmpVariationReviewDecision.builder()
                                .type(EmpVariationReviewDecisionType.ACCEPTED)
                                .details(EmpAcceptedVariationDecisionDetails.builder()
                                        .notes("test notes")
                                        .variationScheduleItems(List.of("change1","change2"))
                                        .build())
                                .build()
                )
                .empVariationDetailsCompleted("true")
                .build();

        EmpVariationApplicationReviewRequestTaskPayload taskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder().build();
        RequestTask requestTask = RequestTask.builder()
                .payload(taskPayload)
                .build();

        service.saveDetailsReviewGroupDecision(taskActionPayload, requestTask);

        assertThat(taskPayload.getEmpVariationDetailsReviewDecision()).isEqualTo(taskActionPayload.getDecision());
        assertEquals("true", taskPayload.getEmpVariationDetailsCompleted());
    }

    @Test
    void saveRequestPeerReviewAction() {
        String selectedPeerReviewer = "peerReviewer";
        String reviewer = "reviewer";
        String reason = "reason";
        AppUser appUser = AppUser.builder().userId(reviewer).build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder().operatorName("name").build())
                .build();
        Map<UUID, String> empAttachments = Map.of(
                UUID.randomUUID(), "attachment"
        );
        Map<UUID, String> reviewAttachments = Map.of(
                UUID.randomUUID(), "reviewAttachment"
        );
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = Map.of(
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                EmpVariationReviewDecision.builder().type(EmpVariationReviewDecisionType.ACCEPTED)
                        .details(ReviewDecisionDetails
                                .builder()
                                .notes("notes")
                                .build())
                        .build());
        EmpVariationDetermination determination = EmpVariationDetermination.builder()
                .type(EmpVariationDeterminationType.DEEMED_WITHDRAWN)
                .reason(reason)
                .build();
        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empAttachments(empAttachments)
                .empVariationDetails
                        (EmpVariationDetails.builder().reason(reason).build())
                .empVariationDetailsReviewCompleted("Test")
                .empVariationDetailsCompleted("Test")
                .empSectionsCompleted(Map.of("a", "b"))
                .reviewAttachments(reviewAttachments)
                .reviewGroupDecisions(reviewGroupDecisions)
                .determination(determination)
                .build();
        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder()
                .payload(requestTaskPayload)
                .request(request)
                .build();

        service.saveRequestPeerReviewAction(requestTask, selectedPeerReviewer, appUser);

        EmpVariationRequestPayload updatedRequestPayload = (EmpVariationRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());

        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertEquals(determination, updatedRequestPayload.getDetermination());
        assertEquals(selectedPeerReviewer, updatedRequestPayload.getRegulatorPeerReviewer());
        assertEquals(reviewer, updatedRequestPayload.getRegulatorReviewer());
        assertEquals(reason, updatedRequestPayload.getEmpVariationDetails().getReason());
        assertEquals("Test", updatedRequestPayload.getEmpVariationDetailsCompleted());
        assertEquals("Test", updatedRequestPayload.getEmpVariationDetailsReviewCompleted());
          assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(Map.of("a", "b"));
        assertThat(updatedRequestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
    }

    @Test
    void saveDecisionNotification() {
        String reviewer = "regUser";
        AppUser appUser = AppUser.builder().userId(reviewer).build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .build();
        DecisionNotification decisionNotification = DecisionNotification.builder().operators(Set.of("operUser")).signatory(reviewer).build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder().operatorName("name").imoNumber("0000000").build())
                .build();
        Map<UUID, String> empAttachments = Map.of(
                UUID.randomUUID(), "attachment"
        );
        Map<String, String> empSectionsCompleted = Map.of(
                "operatorDetails", "COMPLETED"
        );
        Map<UUID, String> reviewAttachments = Map.of(
                UUID.randomUUID(), "reviewAttachment"
        );
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = Map.of(
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                EmpVariationReviewDecision.builder().type(EmpVariationReviewDecisionType.ACCEPTED)
                        .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );
        EmpVariationDetails details = EmpVariationDetails.builder().reason("test reason").build();
        EmpVariationReviewDecision detailsReviewDecision = EmpVariationReviewDecision.builder().build();
        EmpVariationDetermination determination = EmpVariationDetermination.builder().type(EmpVariationDeterminationType.APPROVED).build();
        EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empVariationDetails(details)
                .empVariationDetailsCompleted("true")
                .empVariationDetailsReviewDecision(detailsReviewDecision)
                .empVariationDetailsReviewCompleted("true")
                .empAttachments(empAttachments)
                .empSectionsCompleted(empSectionsCompleted)
                .reviewAttachments(reviewAttachments)
                .reviewGroupDecisions(reviewGroupDecisions)
                .determination(determination)
                .build();
        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder()
                .payload(requestTaskPayload)
                .request(request)
                .build();

        //invoke
        service.saveDecisionNotification(requestTask, decisionNotification, appUser);

        EmpVariationRequestPayload updatedRequestPayload = (EmpVariationRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());

        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertEquals(determination, updatedRequestPayload.getDetermination());
        assertEquals(decisionNotification, updatedRequestPayload.getDecisionNotification());
        assertEquals(reviewer, updatedRequestPayload.getRegulatorReviewer());
        assertEquals(details, updatedRequestPayload.getEmpVariationDetails());
        assertEquals("true", updatedRequestPayload.getEmpVariationDetailsCompleted());
        assertEquals(detailsReviewDecision, updatedRequestPayload.getEmpVariationDetailsReviewDecision());
        assertEquals("true", updatedRequestPayload.getEmpVariationDetailsReviewCompleted());
        assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
    }
}
