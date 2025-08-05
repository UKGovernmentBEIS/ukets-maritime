package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationRegulatorLedApprovedOfficialLetterPreviewHandlerTest {

    @InjectMocks
    private EmpVariationRegulatorLedApprovedOfficialLetterPreviewHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private PreviewOfficialNoticeService previewOfficialNoticeService;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @ParameterizedTest
    @MethodSource("regulatorReasonType")
    void generateDocument(EmpVariationRegulatorLedReason reason, String expectedReason) {
        final Long taskId = 2L;
        final long accountId = 3L;
        final String reqId = "reqId";
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();
        final Request request = Request.builder().id(reqId).requestResources(List.of(RequestResource.builder()
            .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        final String operatorName = "operatorName";
        final EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload taskPayload =
            EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload.builder()
                .reasonRegulatorLed(reason)
                .reviewGroupDecisions(Map.of(
                    EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                    EmpAcceptedVariationDecisionDetails.builder()
                        .variationScheduleItems(List.of("sch_add_inf_1", "sch_add_inf_2")).build(),
                    EmpReviewGroup.EMISSION_SOURCES,
                    EmpAcceptedVariationDecisionDetails.builder()
                        .variationScheduleItems(List.of("sch_inst_details_1")).build())
                )
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                    .operatorDetails(EmpOperatorDetails.builder().operatorName(operatorName).build())
                    .build())
                .build();
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(taskPayload)
            .build();
        final TemplateParams templateParams = TemplateParams.builder()
            .accountParams(MrtmAccountTemplateParams.builder().build())
            .build();
        final FileDTO fileDTO = FileDTO.builder().fileName("filename").build();
        final Map<String, Object> variationParams = Map.of(
            "empConsolidationNumber", 3,
            "variationScheduleItems", List.of(
                "sch_inst_details_1",
                "sch_add_inf_1",
                "sch_add_inf_2"),
            "reason", expectedReason
        );
        final TemplateParams templateParamsWithCustom = TemplateParams.builder()
            .accountParams(MrtmAccountTemplateParams.builder().name(operatorName).build())
            .params(variationParams).build();

        when(empQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(accountId)).thenReturn(2);
        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(previewOfficialNoticeService.generateCommonParams(request, decisionNotification)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED,
            templateParamsWithCustom,
            "emp_variation_approved.pdf")).thenReturn(fileDTO);

        final FileDTO result = handler.generateDocument(taskId, decisionNotification);

        assertEquals(result, fileDTO);
        assertThat(templateParams.getParams()).containsExactlyInAnyOrderEntriesOf(variationParams);
        assertThat(templateParams.getAccountParams().getName()).isEqualTo(operatorName);

        verify(requestTaskService, times(1)).findTaskById(taskId);
        verify(previewOfficialNoticeService, times(1)).generateCommonParams(request, decisionNotification);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateFileDocument(
            MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED,
            templateParamsWithCustom,
            "emp_variation_approved.pdf");
    }

    private static Stream<Arguments> regulatorReasonType() {
        return Stream.of(
            Arguments.of(EmpVariationRegulatorLedReason.builder()
                .type(EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT).build(),
                EmpVariationRegulatorLedReasonType.FOLLOWING_IMPROVING_REPORT.getDescription()),
            Arguments.of(EmpVariationRegulatorLedReason.builder()
                .type(EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY).build(),
                EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY.getDescription()),
            Arguments.of(EmpVariationRegulatorLedReason.builder()
                .type(EmpVariationRegulatorLedReasonType.OTHER).reasonOtherSummary("other reason").build(),
                "The Environment Agency has varied your emissions monitoring plan other reason"),
            Arguments.of(null, "")
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmDocumentTemplateType.EMP_VARIATION_REGULATOR_LED_APPROVED);
    }

    @Test
    void getTaskTypes() {
        assertThat(handler.getTaskTypes()).containsExactly(
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_SUBMIT,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW
        );
    }
}
