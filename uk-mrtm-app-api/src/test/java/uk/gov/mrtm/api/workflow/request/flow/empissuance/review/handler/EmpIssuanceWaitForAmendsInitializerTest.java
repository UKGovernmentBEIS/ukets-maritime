package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceWaitForAmendsInitializerTest {
    private static final UUID DOCUMENT_ID_1 = UUID.randomUUID();
    private static final UUID DOCUMENT_ID_2 = UUID.randomUUID();

    @InjectMocks
    private EmpIssuanceWaitForAmendsInitializer initializer;


    @Test
    void initializePayload() {

        EmissionsMonitoringPlan emissionsMonitoringPlan =
            EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID_1, "1234567");
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
            EmpIssuanceApplicationReviewRequestTaskPayload
                .builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(Map.of("a", "b"))
                .empAttachments(Map.of(DOCUMENT_ID_1, "test"))
                .determination(EmpIssuanceDetermination.builder().build())
                .reviewGroupDecisions(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                    EmpIssuanceReviewDecision.builder().build()))
                .reviewAttachments(Map.of(DOCUMENT_ID_2, "test"))
                .build();

        long accountId = 1L;
        Request request = Request.builder().requestResources(List.of(
            RequestResource.builder()
                .resourceId(String.valueOf(accountId))
                .resourceType(ResourceType.ACCOUNT).build()))
            .payload(payload).build();

        EmpIssuanceApplicationReviewRequestTaskPayload actualRequestTaskPayload =
            (EmpIssuanceApplicationReviewRequestTaskPayload) initializer.initializePayload(request);

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
    void getRequestTaskTypes() {
        assertEquals(initializer.getRequestTaskTypes(), Set.of(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS));
    }

    @Test
    void getRequestTaskPayloadType() {
        assertEquals(MrtmRequestTaskPayloadType.EMP_ISSUANCE_WAIT_FOR_AMENDS_PAYLOAD,
            initializer.getRequestTaskPayloadType());
    }
}