package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.MrtmAccountTemplateParams;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReason;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationReasonType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeFeeDetails;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeTotalMaritimeEmissions;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.templateparams.TemplateParams;
import uk.gov.netz.api.documenttemplate.service.FileDocumentGenerateServiceDelegator;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.Year;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeSubmitOfficialLetterPreviewHandlerTest {


    @InjectMocks
    private DoeSubmitOfficialLetterPreviewHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private PreviewOfficialNoticeService previewOfficialNoticeService;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Test
    void generateDocument() {

        final Long taskId = 2L;
        final String reqId = "reqId";
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();

        final Doe doe = Doe.builder()
                .maritimeEmissions(DoeMaritimeEmissions.builder()
                        .chargeOperator(true)
                        .feeDetails(DoeFeeDetails.builder()
                                .hourlyRate(BigDecimal.ONE)
                                .totalBillableHours(BigDecimal.TEN)
                                .dueDate(LocalDate.of(2023, 12,5))
                                .comments("comments")
                                .build())
                        .determinationReason(DoeDeterminationReason.builder()
                                .type(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT)
                                .furtherDetails("Further details")
                                .build())
                        .totalMaritimeEmissions(DoeTotalMaritimeEmissions.builder()
                                .totalReportableEmissions(BigDecimal.TEN)
                                .calculationApproach("someCalculationApproach")
                                .determinationType(DoeDeterminationType.MARITIME_EMISSIONS)
                                .lessVoyagesInNorthernIrelandDeduction(BigDecimal.ONE)
                                .surrenderEmissions(BigDecimal.TWO)
                                .build())
                        .build())
                .build();

        final DoeRequestPayload requestPayload = DoeRequestPayload.builder()
                .reportingYear(Year.of(2022))
                .doe(doe)
                .build();
        final Request request = Request.builder()
                .id(reqId)
                .payload(requestPayload)
                .build();

        final DoeApplicationSubmitRequestTaskPayload taskPayload =
                DoeApplicationSubmitRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD)
                        .doe(doe)
                        .build();
        final RequestTask requestTask = RequestTask.builder()
                .request(request)
                .payload(taskPayload)
                .build();
        final TemplateParams templateParams = TemplateParams.builder().accountParams(
                MrtmAccountTemplateParams.builder().build()
        ).build();
        final FileDTO fileDTO = FileDTO.builder().fileName("filename").build();
        final Map<String, Object> params = Map.of(
                "totalEmissions", BigDecimal.TEN,
                "reportingYear", Year.of(2022),
                "determinationReasonDescription", String.format(DoeDeterminationReasonType.CORRECTING_NON_MATERIAL_MISSTATEMENT.getDescription(), Year.of(2022)),
                "emissionsCalculationApproachDescription", "someCalculationApproach",
                "lessVoyagesInNorthernIrelandDeduction", BigDecimal.ONE,
                "surrenderEmissions", BigDecimal.TWO
        );
        final TemplateParams templateParamsWithCustom = TemplateParams.builder()
                .accountParams(MrtmAccountTemplateParams.builder().build())
                .params(params).build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(previewOfficialNoticeService.generateCommonParams(request, decisionNotification)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
                MrtmDocumentTemplateType.DOE_SUBMITTED,
                templateParamsWithCustom,
                "DoE_and_EFSN_Notice.pdf")).thenReturn(fileDTO);

        final FileDTO result = handler.generateDocument(taskId, decisionNotification);

        assertEquals(result, fileDTO);
        assertThat(templateParams.getParams()).containsExactlyInAnyOrderEntriesOf(params);

        verify(requestTaskService, times(1)).findTaskById(taskId);
        verify(previewOfficialNoticeService, times(1)).generateCommonParams(request, decisionNotification);
        verify(fileDocumentGenerateServiceDelegator, times(1)).generateFileDocument(
                MrtmDocumentTemplateType.DOE_SUBMITTED,
                templateParamsWithCustom,
                "DoE_and_EFSN_Notice.pdf");
    }

    @Test
    void getTypes(){
        assertThat(handler.getTypes()).containsExactlyInAnyOrder(
                MrtmDocumentTemplateType.DOE_SUBMITTED, MrtmDocumentTemplateType.DOE_EFSN_SUBMITTED);
    }
}
