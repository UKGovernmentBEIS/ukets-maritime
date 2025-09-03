package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationApplicationReviewRequestTaskInitializerTest {

    @InjectMocks
    private EmpVariationApplicationReviewRequestTaskInitializer initializer;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Test
    void initializePayload() {
        UUID attachment = UUID.randomUUID();
        Long accountId = 1L;
        Set<EmpReviewGroup> updatedSubtasks = Set.of(EmpReviewGroup.ADDITIONAL_DOCUMENTS);

        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan
                .builder()
                .abbreviations(EmpAbbreviations
                        .builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder().exist(false).build())
                .operatorDetails(EmpOperatorDetails.builder().operatorName("name").build())
                .build();
        EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emp)
                .empAttachments(Map.of(attachment, "attachment"))
                .build();
        when(empQueryService.getEmissionsMonitoringPlanDTOByAccountId(accountId))
            .thenReturn(Optional.ofNullable(
                EmissionsMonitoringPlanDTO
                    .builder()
                    .empContainer(empContainer)
                    .build())
            );
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .emissionsMonitoringPlan(empContainer.getEmissionsMonitoringPlan())
                .empVariationDetails(EmpVariationDetails.builder().reason("test reason").build())
                .empVariationDetailsCompleted("true")
                .updatedSubtasks(updatedSubtasks)
                .empSectionsCompleted(Map.of("section1", "completed"))
                .build();
        Request request = Request.builder().requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload).build();


        // invoke
        RequestTaskPayload result = initializer.initializePayload(request);
        EmpVariationApplicationReviewRequestTaskPayload variationTaskPayloadResult = (EmpVariationApplicationReviewRequestTaskPayload) result;

        assertThat(variationTaskPayloadResult.getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName())
                .isEqualTo(requestPayload.getEmissionsMonitoringPlan().getOperatorDetails().getOperatorName());
        assertThat(variationTaskPayloadResult.getEmissionsMonitoringPlan().getAbbreviations())
                .isEqualTo(requestPayload.getEmissionsMonitoringPlan().getAbbreviations());
        assertThat(variationTaskPayloadResult.getEmpVariationDetailsReviewDecision()).isNull();
        assertThat(variationTaskPayloadResult.getEmpVariationDetails()).isEqualTo(requestPayload.getEmpVariationDetails());
        assertThat(variationTaskPayloadResult.getEmpVariationDetailsCompleted()).isEqualTo(requestPayload.getEmpVariationDetailsCompleted());
        assertTrue(variationTaskPayloadResult.getEmpSectionsCompleted().isEmpty());
        assertThat(variationTaskPayloadResult.getOriginalEmpContainer()).isEqualTo(empContainer);
        assertThat(variationTaskPayloadResult.getReviewGroupDecisions().keySet())
                .containsExactlyInAnyOrder(EmpReviewGroup.MARITIME_OPERATOR_DETAILS,
                        EmpReviewGroup.SHIPS_CALCULATION_EMISSIONS,
                        EmpReviewGroup.MONITORING_APPROACH,
                        EmpReviewGroup.EMISSION_SOURCES,
                        EmpReviewGroup.MANAGEMENT_PROCEDURES,
                        EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                        EmpReviewGroup.DATA_GAPS,
                        EmpReviewGroup.CONTROL_ACTIVITIES,
                        EmpReviewGroup.MANDATE);

        verify(empQueryService).getEmissionsMonitoringPlanDTOByAccountId(accountId);
        verifyNoMoreInteractions(empQueryService);
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactlyInAnyOrder(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW
        );
    }
}
