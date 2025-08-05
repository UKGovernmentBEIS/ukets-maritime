package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReturnedForAmendsRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ChangesRequiredDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionRequiredChange;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpReviewMapperTest {
    private final EmpReviewMapper empReviewMapper = Mappers.getMapper(EmpReviewMapper.class);

    private static final UUID DOCUMENT_ID_1 = UUID.randomUUID();
    private static final UUID DOCUMENT_ID_2 = UUID.randomUUID();
    private static final String IMO_NUMBER = "7654321";

    @Test
    void toEmpIssuanceApplicationReviewRequestTaskPayload() {
        String payloadType = "payloadType";
        EmissionsMonitoringPlan emissionsMonitoringPlan =
            EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID_1, IMO_NUMBER);

        EmpIssuanceRequestPayload payload = EmpIssuanceRequestPayload.builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .empSectionsCompleted(Map.of("a", "b"))
            .empAttachments(Map.of(DOCUMENT_ID_1, "test"))
            .reviewGroupDecisions(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                EmpIssuanceReviewDecision.builder().build()))
            .reviewAttachments(Map.of(DOCUMENT_ID_2, "test"))
            .determination(EmpIssuanceDetermination.builder().build())
            .decisionNotification(DecisionNotification.builder().build())
            .build();

        EmpIssuanceApplicationReviewRequestTaskPayload expectedRequestTaskPayload =
                getEmpIssuanceApplicationReviewRequestTaskPayload(emissionsMonitoringPlan);

        EmpIssuanceApplicationReviewRequestTaskPayload actualRequestTaskPayload = empReviewMapper
            .toEmpIssuanceApplicationReviewRequestTaskPayload(payload,payloadType);

        assertEquals(expectedRequestTaskPayload.getEmissionsMonitoringPlan(),
            actualRequestTaskPayload.getEmissionsMonitoringPlan());
        assertThat(actualRequestTaskPayload.getEmpSectionsCompleted()).isEmpty();
        assertEquals(expectedRequestTaskPayload.getEmpAttachments(),
            actualRequestTaskPayload.getEmpAttachments());
        assertEquals(expectedRequestTaskPayload.getDetermination(),
            actualRequestTaskPayload.getDetermination());
        assertEquals(expectedRequestTaskPayload.getReviewGroupDecisions(),
            actualRequestTaskPayload.getReviewGroupDecisions());
        assertEquals(expectedRequestTaskPayload.getReviewAttachments(),
            actualRequestTaskPayload.getReviewAttachments());
        assertEquals(expectedRequestTaskPayload.getRfiAttachments(),
            actualRequestTaskPayload.getRfiAttachments());
    }

    @Test
    void toEmissionsMonitoringPlanContainer() {
        EmissionsMonitoringPlan emissionsMonitoringPlan =
                EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID_1, IMO_NUMBER);

        Map<UUID, String> empAttachments = Map.of(DOCUMENT_ID_1, "test");

        EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
                getEmpIssuanceApplicationReviewRequestTaskPayload(emissionsMonitoringPlan);

        EmissionsMonitoringPlanContainer empContainer = empReviewMapper.toEmissionsMonitoringPlanContainer(reviewRequestTaskPayload);

        assertEquals(emissionsMonitoringPlan, empContainer.getEmissionsMonitoringPlan());
        assertThat(empContainer.getEmpAttachments()).containsExactlyInAnyOrderEntriesOf(empAttachments);
    }

    @Test
    void toEmpIssuanceApplicationReturnedForAmendsRequestActionPayload() {
        String payloadType = "payloadType";
        EmissionsMonitoringPlan emissionsMonitoringPlan =
            EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID_1, IMO_NUMBER);
        EmpIssuanceReviewDecision amendDecision =
            EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED)
            .details(
                ChangesRequiredDecisionDetails
                    .builder()
                    .requiredChanges(
                        List.of(ReviewDecisionRequiredChange.builder()
                            .reason("reason")
                            .files(Set.of(DOCUMENT_ID_2))
                            .build()
                        )
                    )
                    .notes("notes2")
                    .build()
            )
            .build();

        EmpIssuanceApplicationReviewRequestTaskPayload payload = EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .empSectionsCompleted(Map.of("a", "b"))
            .reviewAttachments(Map.of(DOCUMENT_ID_2, "testReview"))
            .empAttachments(Map.of(DOCUMENT_ID_1, "test"))
            .reviewGroupDecisions(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                EmpIssuanceReviewDecision.builder().type(EmpReviewDecisionType.ACCEPTED)
                    .details(
                        ReviewDecisionDetails
                            .builder()
                            .notes("notes")
                            .build()
                    )
                    .build(),
                    EmpReviewGroup.ADDITIONAL_DOCUMENTS,
                    amendDecision
                )
            )
            .reviewAttachments(Map.of(DOCUMENT_ID_2, "test"))
            .determination(EmpIssuanceDetermination.builder().build())
            .build();

        EmpIssuanceApplicationReturnedForAmendsRequestActionPayload actualRequestTaskPayload = empReviewMapper
            .toEmpIssuanceApplicationReturnedForAmendsRequestActionPayload(payload, payloadType);

        assertThat(actualRequestTaskPayload.getReviewGroupDecisions().size()).isEqualTo(1);
        assertEquals(amendDecision.getType(),
            actualRequestTaskPayload.getReviewGroupDecisions().get(EmpReviewGroup.ADDITIONAL_DOCUMENTS).getType());
        assertThat(actualRequestTaskPayload.getReviewGroupDecisions().get(EmpReviewGroup.ADDITIONAL_DOCUMENTS)
            .getDetails().getNotes()).isNull();
        assertEquals(((ChangesRequiredDecisionDetails) (amendDecision.getDetails())).getRequiredChanges(),
            ((ChangesRequiredDecisionDetails) (actualRequestTaskPayload.getReviewGroupDecisions()
                .get(EmpReviewGroup.ADDITIONAL_DOCUMENTS).getDetails())).getRequiredChanges());
        assertEquals(actualRequestTaskPayload.getReviewAttachments(), Map.of(DOCUMENT_ID_2, "test"));
    }


    private  EmpIssuanceApplicationReviewRequestTaskPayload getEmpIssuanceApplicationReviewRequestTaskPayload(
        EmissionsMonitoringPlan emissionsMonitoringPlan) {
        return EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .emissionsMonitoringPlan(emissionsMonitoringPlan)
            .empSectionsCompleted(Map.of("a", "b"))
            .empAttachments(Map.of(DOCUMENT_ID_1, "test"))
            .determination(EmpIssuanceDetermination.builder().build())
            .reviewGroupDecisions(Map.of(
                EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpIssuanceReviewDecision.builder().build()))
            .reviewAttachments(Map.of(DOCUMENT_ID_2, "test"))
            .build();
    }

}