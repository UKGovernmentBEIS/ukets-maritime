package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviationDefinition;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.datagaps.EmpDataGaps;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;

@ExtendWith(MockitoExtension.class)
public class EmpVariationAmendServiceTest {

    @InjectMocks
    private EmpVariationAmendService service;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private RequestService requestService;

    @Test
    void saveAmend() {
        EmissionsMonitoringPlan updatedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .build();
        Map<String, String> updatedEmpSectionsCompleted = Map.of("task", "false");
        Set<EmpReviewGroup> updatedSubtasks = Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS);

        EmpVariationSaveApplicationAmendRequestTaskActionPayload actionPayload =
                EmpVariationSaveApplicationAmendRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_VARIATION_SAVE_APPLICATION_AMEND_PAYLOAD)
                        .emissionsMonitoringPlan(updatedEmissionsMonitoringPlan)
                        .empSectionsCompleted(updatedEmpSectionsCompleted)
                        .empVariationDetails(EmpVariationDetails.builder().reason("reason").build())
                        .updatedSubtasks(updatedSubtasks)
                        .empVariationDetailsCompleted("true")
                        .empVariationDetailsReviewCompleted("true")
                        .empVariationDetailsAmendCompleted("true")
                        .build();
        RequestTask requestTask = RequestTask.builder()
                .payload(EmpVariationApplicationAmendsSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMIT_PAYLOAD)
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder()
                                        .exist(true)
                                        .abbreviationDefinitions(List.of(
                                                EmpAbbreviationDefinition.builder().definition("definition").build())
                                        )
                                        .build())
                                .build())
                        .empSectionsCompleted(Map.of("task", "true"))
                        .build())
                .build();

        // Invoke
        service.saveAmend(actionPayload, requestTask);

        // Verify
        assertThat(requestTask.getPayload()).isInstanceOf(EmpVariationApplicationAmendsSubmitRequestTaskPayload.class);

        EmpVariationApplicationAmendsSubmitRequestTaskPayload updatedRequestTaskPayload =
                (EmpVariationApplicationAmendsSubmitRequestTaskPayload) requestTask.getPayload();

        assertThat(updatedRequestTaskPayload.getEmissionsMonitoringPlan()).isEqualTo(updatedEmissionsMonitoringPlan);
        assertThat(updatedRequestTaskPayload.getEmpSectionsCompleted()).isEqualTo(updatedEmpSectionsCompleted);
        assertThat(updatedRequestTaskPayload.getEmpVariationDetails()).isEqualTo(updatedRequestTaskPayload.getEmpVariationDetails());
        assertThat(updatedRequestTaskPayload.getEmpVariationDetailsCompleted()).isEqualTo(updatedRequestTaskPayload.getEmpVariationDetailsCompleted());
        assertThat(updatedRequestTaskPayload.getEmpVariationDetailsReviewCompleted()).isEqualTo(updatedRequestTaskPayload.getEmpVariationDetailsReviewCompleted());
        assertThat(updatedRequestTaskPayload.getEmpVariationDetailsAmendCompleted()).isEqualTo(updatedRequestTaskPayload.getEmpVariationDetailsAmendCompleted());
        assertThat(updatedRequestTaskPayload.getUpdatedSubtasks()).isEqualTo(updatedSubtasks);
    }

    @Test
    void submitAmend() {
        String operator = "operator";
        Long accountId = 1L;
        Set<EmpReviewGroup> updatedSubtasks =
            Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS, EmpReviewGroup.MARITIME_OPERATOR_DETAILS);
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = new HashMap<>();
        reviewGroupDecisions.put(
            EmpReviewGroup.ADDITIONAL_DOCUMENTS,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build());
        reviewGroupDecisions.put(
            EmpReviewGroup.EMISSION_SOURCES,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );

        Map<EmpReviewGroup, EmpVariationReviewDecision> expectedReviewGroupDecisions = Map.of(
            EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build(),

            EmpReviewGroup.EMISSION_SOURCES,
            EmpVariationReviewDecision.builder()
                .type(EmpVariationReviewDecisionType.ACCEPTED)
                .details(ReviewDecisionDetails.builder().notes("notes").build()).build()
        );

        AppUser appUser = AppUser.builder().userId(operator).build();
        EmissionsMonitoringPlan monitoringPlan = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder()
                        .build())
                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                .build();
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "test.png");

        EmpVariationApplicationAmendsSubmitRequestTaskPayload taskPayload = EmpVariationApplicationAmendsSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(monitoringPlan)
                .empAttachments(empAttachments)
                .updatedSubtasks(updatedSubtasks)
                .empVariationDetails(EmpVariationDetails.builder().reason("reason").build())
                .empVariationDetailsCompleted("true")
                .empVariationDetailsReviewCompleted("true")
                .empVariationDetailsAmendCompleted("true")
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .dataGaps(EmpDataGaps.builder().dataSources("dataGaps").build())
                        .build())
                .reviewGroupDecisions(reviewGroupDecisions)
                .build();
        Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .build();
        RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(taskPayload)
                .build();

        EmissionsMonitoringPlanContainer monitoringPlanContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(monitoringPlan)
                .empAttachments(empAttachments)
                .build();
        EmpVariationApplicationAmendsSubmittedRequestActionPayload requestActionPayload = EmpVariationApplicationAmendsSubmittedRequestActionPayload.builder()
            .emissionsMonitoringPlan(monitoringPlan)
            .empVariationDetails(taskPayload.getEmpVariationDetails())
            .empAttachments(empAttachments)
            .payloadType(MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_AMENDS_SUBMITTED_PAYLOAD)
            .build();

        // Invoke
        service.submitAmend(requestTask, appUser);

        // Verify
        assertThat(request.getPayload()).isInstanceOf(EmpVariationRequestPayload.class);

        EmpVariationRequestPayload updatedRequestPayload = (EmpVariationRequestPayload) request.getPayload();

        assertThat(updatedRequestPayload.getEmissionsMonitoringPlan()).isEqualTo(monitoringPlan);
        assertThat(updatedRequestPayload.getEmpAttachments()).isEqualTo(empAttachments);
        assertThat(updatedRequestPayload.getEmpVariationDetails()).isEqualTo(taskPayload.getEmpVariationDetails());
        assertThat(updatedRequestPayload.getEmpVariationDetailsCompleted()).isEqualTo(taskPayload.getEmpVariationDetailsCompleted());
        assertThat(updatedRequestPayload.getEmpVariationDetailsReviewCompleted()).isEqualTo(taskPayload.getEmpVariationDetailsReviewCompleted());
        assertThat(updatedRequestPayload.getReviewGroupDecisions()).isNotEmpty();
        assertEquals(expectedReviewGroupDecisions, requestPayload.getReviewGroupDecisions());

        verify(empValidatorService, times(1))
                .validateEmissionsMonitoringPlan(monitoringPlanContainer, accountId);
        verify(requestService, times(1))
            .addActionToRequest(request,
                requestActionPayload,
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_AMENDS_SUBMITTED,
                operator);
        verifyNoMoreInteractions(empValidatorService, requestService);
    }
}
