package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirOfficialNoticeService;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class VirPreviewHandlerTest {

    @Mock
    private VirOfficialNoticeService virOfficialNoticeService;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestTaskService requestTaskService;

    @InjectMocks
    private VirPreviewHandler virPreviewHandler;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void generateDocument() {
        Long taskId = 1L;
        DecisionNotification decisionNotification = new DecisionNotification();
        RequestTask requestTask = mock(RequestTask.class);
        Request request = mock(Request.class);
        VirRequestPayload requestPayload = new VirRequestPayload();
        VirApplicationReviewRequestTaskPayload taskPayload = new VirApplicationReviewRequestTaskPayload();
        FileDTO fileDTO = new FileDTO();

        when(requestTaskService.findTaskById(taskId)).thenReturn(requestTask);
        when(requestTask.getRequest()).thenReturn(request);
        when(request.getId()).thenReturn("1L");
        when(requestService.findRequestById("1L")).thenReturn(request);
        when(request.getPayload()).thenReturn(requestPayload);
        when(requestTask.getPayload()).thenReturn(taskPayload);
        when(virOfficialNoticeService.doGenerateOfficialNoticeWithoutSave(request)).thenReturn(fileDTO);

        FileDTO result = virPreviewHandler.generateDocument(taskId, decisionNotification);

        assertEquals(fileDTO, result);
        verify(requestTaskService).findTaskById(taskId);
        verify(requestService).findRequestById("1L");
        verify(virOfficialNoticeService).doGenerateOfficialNoticeWithoutSave(request);
    }

    @Test
    void getTypes() {
        List<String> types = virPreviewHandler.getTypes();
        assertEquals(1, types.size());
        assertEquals(MrtmDocumentTemplateType.VIR_REVIEWED, types.get(0));
    }

    @Test
    void getTaskTypes() {
        List<String> taskTypes = virPreviewHandler.getTaskTypes();
        assertEquals(1, taskTypes.size());
        assertEquals(MrtmRequestTaskType.VIR_APPLICATION_REVIEW, taskTypes.get(0));
    }
}
