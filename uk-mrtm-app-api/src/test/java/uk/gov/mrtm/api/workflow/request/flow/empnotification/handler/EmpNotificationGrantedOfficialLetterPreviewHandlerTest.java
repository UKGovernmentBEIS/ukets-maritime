package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.PreviewOfficialNoticeService;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationGrantedOfficialLetterPreviewHandlerTest {
    @InjectMocks
    private EmpNotificationGrantedOfficialLetterPreviewHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private PreviewOfficialNoticeService previewOfficialNoticeService;

    @Mock
    private FileDocumentGenerateServiceDelegator fileDocumentGenerateServiceDelegator;

    @Test
    void generateDocument() {

        final Long taskId = 2L;
        final long accountId = 3L;
        final String filename = "EMP Notification Acknowledgement Letter.pdf";
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();
        final EmpNotificationRequestPayload requestPayload = EmpNotificationRequestPayload.builder().build();
        final Request request = Request.builder().requestResources(List.of(RequestResource.builder()
                .resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build()))
            .payload(requestPayload)
            .build();
        final EmpNotificationApplicationReviewRequestTaskPayload taskPayload =
            EmpNotificationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_NOTIFICATION_APPLICATION_REVIEW_PAYLOAD)
                .reviewDecision(EmpNotificationReviewDecision.builder()
                    .type(EmpNotificationReviewDecisionType.ACCEPTED)
                    .details(EmpNotificationAcceptedDecisionDetails.builder()
                        .officialNotice("officialNotice")
                        .build())
                    .build())
                .build();
        final RequestTask requestTask = RequestTask.builder()
            .request(request)
            .payload(taskPayload)
            .build();
        final TemplateParams templateParams = TemplateParams.builder().build();
        final FileDTO fileDTO = FileDTO.builder().fileName(filename).build();
        final Map<String, Object> variationParams = Map.of(
            "officialNotice", "officialNotice"
        );
        final TemplateParams templateParamsWithCustom = TemplateParams.builder().params(variationParams).build();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(previewOfficialNoticeService.generateCommonParams(request, decisionNotification)).thenReturn(templateParams);
        when(fileDocumentGenerateServiceDelegator.generateFileDocument(
            MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
            templateParamsWithCustom,
            filename)
        ).thenReturn(fileDTO);

        final FileDTO result = handler.generateDocument(taskId, decisionNotification);

        assertEquals(result, fileDTO);

        verify(requestTaskService).findTaskById(taskId);
        verify(previewOfficialNoticeService).generateCommonParams(request, decisionNotification);
        verify(fileDocumentGenerateServiceDelegator).generateFileDocument(
            MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED,
            templateParamsWithCustom,
            filename);

        verifyNoMoreInteractions(requestTaskService, previewOfficialNoticeService, fileDocumentGenerateServiceDelegator);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmDocumentTemplateType.EMP_NOTIFICATION_ACCEPTED);
    }

    @Test
    void getTaskTypes() {
        assertThat(handler.getTaskTypes()).containsExactly(
            MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_REVIEW,
            MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW,
            MrtmRequestTaskType.EMP_NOTIFICATION_WAIT_FOR_PEER_REVIEW
        );
    }
}