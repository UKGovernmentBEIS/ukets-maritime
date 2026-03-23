package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviationDefinition;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures.EmpManagementProcedures;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveApplicationReviewRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
class RequestEmpReviewServiceTest {

    @InjectMocks
    private RequestEmpReviewService requestEmpReviewService;

    @Test
    void applySaveAction() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build())
            .empSectionsCompleted(Map.of(
                "additionalDocuments", "COMPLETED",
                "methodAProcedures", "COMPLETED"
            ))
            .reviewGroupDecisions(new HashMap<>(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
            )))
            .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder().exist(false).build())
            .additionalDocuments(AdditionalDocuments.builder().exist(true).documents(Set.of(UUID.randomUUID())).build())
            .build();
        Map<String, String> empSectionsCompleted = Map.of(
            "abbreviations", "COMPLETED",
            "additionalDocuments", "COMPLETED"
        );

        EmpIssuanceSaveApplicationReviewRequestTaskActionPayload requestTaskActionPayload =
            EmpIssuanceSaveApplicationReviewRequestTaskActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        requestEmpReviewService.applySaveAction(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);

        EmpIssuanceApplicationReviewRequestTaskPayload
            updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(emissionsMonitoringPlan);
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        ));
    }

    @Test
    void applySaveAction_with_reset_determination() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .managementProcedures(EmpManagementProcedures.builder().build())
                .build())
            .empSectionsCompleted(Map.of(
                "additionalDocuments", "COMPLETED",
                "managementProcedures", "COMPLETED"
            ))
            .reviewGroupDecisions(new HashMap<>(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
            )))
            .determination(EmpIssuanceDetermination.builder().type(EmpIssuanceDeterminationType.APPROVED).build())
            .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder().exist(false).build())
            .additionalDocuments(AdditionalDocuments.builder().exist(true).documents(Set.of(UUID.randomUUID())).build())
            .build();
        Map<String, String> empSectionsCompleted = Map.of(
            "abbreviations", "COMPLETED",
            "additionalDocuments", "COMPLETED"
        );

        EmpIssuanceSaveApplicationReviewRequestTaskActionPayload requestTaskActionPayload =
            EmpIssuanceSaveApplicationReviewRequestTaskActionPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        requestEmpReviewService.applySaveAction(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);

        EmpIssuanceApplicationReviewRequestTaskPayload
            updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(emissionsMonitoringPlan);
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        ));
        assertThat(updatedRequestTaskPayload.getDetermination()).isNull();
    }

    @Test
    void saveReviewGroupDecision() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build())
            .empSectionsCompleted(Map.of(
                "additionalDocuments", "COMPLETED"
            ))
            .reviewGroupDecisions(new HashMap<>(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
            )))
            .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        Map<String, String> empSectionsCompleted = Map.of(
            "abbreviations", "COMPLETED",
            "additionalDocuments", "COMPLETED"
        );
        EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload requestTaskActionPayload =
            EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                .reviewGroup(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                .decision(EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build())
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        requestEmpReviewService.saveReviewGroupDecision(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);

        EmpIssuanceApplicationReviewRequestTaskPayload
            updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(requestTaskPayload.getEmissionsMonitoringPlan());
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(requestTaskPayload.getEmpSectionsCompleted());

        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build(),
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        ));
        assertThat(updatedRequestTaskPayload.getDetermination()).isNull();
    }

    @Test
    void saveReviewGroupDecision_reset_determination() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .build())
            .empSectionsCompleted(Map.of(
                "additionalDocuments", "COMPLETED"
            ))
            .reviewGroupDecisions(new HashMap<>(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
            )))
            .determination(EmpIssuanceDetermination.builder().type(EmpIssuanceDeterminationType.APPROVED).build())
            .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        Map<String, String> empSectionsCompleted = Map.of(
            "abbreviations", "COMPLETED",
            "additionalDocuments", "COMPLETED"
        );
        EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload requestTaskActionPayload =
            EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                .reviewGroup(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                .decision(EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build())
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        requestEmpReviewService.saveReviewGroupDecision(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);

        EmpIssuanceApplicationReviewRequestTaskPayload
            updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(requestTaskPayload.getEmissionsMonitoringPlan());
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(requestTaskPayload.getEmpSectionsCompleted());

        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build(),
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        ));
        assertThat(updatedRequestTaskPayload.getDetermination()).isNull();
    }

    @Test
    void saveReviewGroupDecision_determination_withdrawn() {
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                        .build())
                .empSectionsCompleted(Map.of(
                        "additionalDocuments", "COMPLETED"
                ))
                .reviewGroupDecisions(new HashMap<>(Map.of(
                        EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
                )))
                .determination(EmpIssuanceDetermination.builder().type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN).build())
                .build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).build();

        Map<String, String> empSectionsCompleted = Map.of(
                "abbreviations", "COMPLETED",
                "additionalDocuments", "COMPLETED"
        );
        EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload requestTaskActionPayload =
                EmpIssuanceSaveReviewGroupDecisionRequestTaskActionPayload.builder()
                        .reviewGroup(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS)
                        .decision(EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build())
                        .empSectionsCompleted(empSectionsCompleted)
                        .build();

        requestEmpReviewService.saveReviewGroupDecision(requestTaskActionPayload, requestTask);

        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationReviewRequestTaskPayload.class);

        EmpIssuanceApplicationReviewRequestTaskPayload
                updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(requestTaskPayload.getEmissionsMonitoringPlan());
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(requestTaskPayload.getEmpSectionsCompleted());

        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(Map.of(
                EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build(),
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).build()
        ));
        assertThat(updatedRequestTaskPayload.getDetermination().getType()).isEqualTo(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN);
    }

    @Test
    void saveDetermination() {
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder()
            .type(EmpIssuanceDeterminationType.APPROVED)
            .reason("reason")
            .build();

        EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload taskActionPayload =
            EmpIssuanceSaveReviewDeterminationRequestTaskActionPayload.builder()
                .determination(determination)
                .build();

        EmpIssuanceApplicationReviewRequestTaskPayload taskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder().build())
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
                .build();

        RequestTask requestTask = RequestTask.builder().payload(taskPayload).build();

        requestEmpReviewService.saveDetermination(taskActionPayload, requestTask);

        EmpIssuanceApplicationReviewRequestTaskPayload
            updatedRequestTaskPayload = (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        assertEquals(determination, updatedRequestTaskPayload.getDetermination());
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(taskActionPayload.getEmpSectionsCompleted());
    }

    @Test
    void saveRequestReturnForAmends() {
        String reviewer = "reviewer";
        AppUser appUser = AppUser.builder().userId(reviewer).build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
            .build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder().exist(false).build())
            .build();
        Map<UUID, String> empAttachments = Map.of(
            UUID.randomUUID(), "attachment"
        );
        Map<String, String> empSectionsCompleted = Map.of(
            "abbreviations", "test"
        );
        Map<UUID, String> reviewAttachments = Map.of(
            UUID.randomUUID(), "reviewAttachment"
        );
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = Map.of(
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED).details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );

        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .empAttachments(empAttachments)
            .empSectionsCompleted(empSectionsCompleted)
            .reviewAttachments(reviewAttachments)
            .reviewGroupDecisions(reviewGroupDecisions)
            .build();
        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder()
            .payload(requestTaskPayload)
            .request(request)
            .build();

        requestEmpReviewService.saveRequestReturnForAmends(requestTask, appUser);

        EmpIssuanceRequestPayload updatedRequestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());

        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertEquals(reviewer, updatedRequestPayload.getRegulatorReviewer());
        assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
    }

    @Test
    void saveDecisionNotification() {
        String reviewer = "regUser";
        AppUser appUser = AppUser.builder().userId(reviewer).build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
            .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
            .build();
        DecisionNotification decisionNotification = DecisionNotification.builder().operators(Set.of("operUser")).signatory(reviewer).build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .operatorDetails(EmpOperatorDetails.builder().operatorName("name").imoNumber("1234567").build())
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
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = Map.of(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder().type(EmpIssuanceDeterminationType.APPROVED).build();
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
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
        requestEmpReviewService.saveDecisionNotification(requestTask, decisionNotification, appUser);

        EmpIssuanceRequestPayload updatedRequestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());

        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertEquals(determination, updatedRequestPayload.getDetermination());
        assertEquals(decisionNotification, updatedRequestPayload.getDecisionNotification());
        assertEquals(reviewer, updatedRequestPayload.getRegulatorReviewer());
        assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
    }

    @Test
    void saveRequestPeerReviewAction() {
        String selectedPeerReviewer = "peerReviewer";
        String reviewer = "reviewer";
        AppUser appUser = AppUser.builder().userId(reviewer).build();
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD)
                .build();

        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder().operatorName("name").build())
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
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = Map.of(
                EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED).details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder()
                .type(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN)
                .reason("withdrawn reason")
                .build();
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
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

        requestEmpReviewService.saveRequestPeerReviewAction(requestTask, selectedPeerReviewer, appUser);

        EmpIssuanceRequestPayload updatedRequestPayload = (EmpIssuanceRequestPayload) request.getPayload();

        assertEquals(MrtmRequestPayloadType.EMP_ISSUANCE_REQUEST_PAYLOAD, updatedRequestPayload.getPayloadType());

        assertEquals(emissionsMonitoringPlan, updatedRequestPayload.getEmissionsMonitoringPlan());
        assertEquals(determination, updatedRequestPayload.getDetermination());
        assertEquals(selectedPeerReviewer, updatedRequestPayload.getRegulatorPeerReviewer());
        assertEquals(reviewer, updatedRequestPayload.getRegulatorReviewer());
        assertThat(updatedRequestPayload.getEmpSectionsCompleted()).containsExactlyInAnyOrderEntriesOf(empSectionsCompleted);
        assertThat(updatedRequestPayload.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
        assertThat(updatedRequestPayload.getReviewAttachments()).containsExactlyInAnyOrderEntriesOf(reviewAttachments);
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).containsExactlyInAnyOrderEntriesOf(reviewGroupDecisions);
    }

    @Test
    void saveAmend() {
        EmissionsMonitoringPlan updatedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder()
                .exist(false)
                .build())
            .build();
        Map<String, String> updatedEmpSectionsCompleted = Map.of("task", "test value");
        Set<EmpReviewGroup> updatedSubtasks = Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS);

        EmpIssuanceSaveApplicationAmendRequestTaskActionPayload actionPayload =
            EmpIssuanceSaveApplicationAmendRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_ISSUANCE_SAVE_APPLICATION_AMEND_PAYLOAD)
                .emissionsMonitoringPlan(updatedEmissionsMonitoringPlan)
                .updatedSubtasks(updatedSubtasks)
                .empSectionsCompleted(updatedEmpSectionsCompleted)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .payload(EmpIssuanceApplicationAmendsSubmitRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_AMENDS_SUBMIT_PAYLOAD)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                    .abbreviations(EmpAbbreviations.builder()
                        .exist(true)
                        .abbreviationDefinitions(List.of(
                            EmpAbbreviationDefinition.builder().definition("definition").build())
                        )
                        .build())
                    .build())
                .empSectionsCompleted(Map.of("task", "test value"))
                .build())
            .build();

        // Invoke
        requestEmpReviewService.saveAmend(actionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(EmpIssuanceApplicationAmendsSubmitRequestTaskPayload.class);

        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload updatedRequestTaskPayload =
            (EmpIssuanceApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getUpdatedSubtasks()).isEqualTo(updatedSubtasks);
        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(updatedEmissionsMonitoringPlan);
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).isEqualTo(updatedEmpSectionsCompleted);
    }

    @Test
    void submitAmend() {
        Set<EmpReviewGroup> updatedSubtasks =
            Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpReviewGroup.MARITIME_OPERATOR_DETAILS);
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = new HashMap<>();
        UUID fileUuuid = UUID.randomUUID();
        reviewGroupDecisions.put(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes")
                    .requiredChanges(List.of(ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(fileUuuid)).build()))
                    .build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes")
                    .requiredChanges(List.of(ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(fileUuuid)).build()))
                    .build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.EMISSION_SOURCES,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );

        Map<EmpReviewGroup, EmpIssuanceReviewDecision> expectedReviewGroupDecisions = Map.of(
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ChangesRequiredDecisionDetails.builder().notes("notes")
                    .requiredChanges(List.of(ReviewDecisionRequiredChange.builder().reason("reason").files(Set.of(fileUuuid)).build()))
                    .build())
                .build(),

            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpIssuanceReviewDecision.builder()
                .details(ReviewDecisionDetails.builder().notes("notes").build())
                .type(null)
                .build(),

            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpIssuanceReviewDecision.builder()
                .details(ChangesRequiredDecisionDetails.builder().notes("notes").requiredChanges(null).build())
                .type(null)
                .build(),

            EmpReviewGroup.EMISSION_SOURCES,
            EmpIssuanceReviewDecision.builder()
                .type(EmpReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );


        EmissionsMonitoringPlan emissionsMonitoringPlan = mock(EmissionsMonitoringPlan.class);
        EmpIssuanceRequestPayload requestPayload = EmpIssuanceRequestPayload.builder().reviewGroupDecisions(reviewGroupDecisions).build();
        Map<UUID, String> empAttachments = Map.of(fileUuuid, "attachment");
        Map<String, String> empSectionsCompleted = Map.of("test", "COMPLETED");

        EmpIssuanceApplicationAmendsSubmitRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationAmendsSubmitRequestTaskPayload.builder()
                .empAttachments(empAttachments)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .reviewGroupDecisions(reviewGroupDecisions)
                .updatedSubtasks(updatedSubtasks)
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        Request request = Request.builder().payload(requestPayload).build();
        RequestTask requestTask = RequestTask.builder().payload(requestTaskPayload).request(request).build();

        // Invoke
        requestEmpReviewService.submitAmend(requestTask);

        // Verify
        assertEquals(expectedReviewGroupDecisions, requestPayload.getReviewGroupDecisions());
        assertEquals(empAttachments, requestPayload.getEmpAttachments());
        assertEquals(emissionsMonitoringPlan, requestPayload.getEmissionsMonitoringPlan());
        assertEquals(empSectionsCompleted, requestPayload.getEmpSectionsCompleted());
    }
}