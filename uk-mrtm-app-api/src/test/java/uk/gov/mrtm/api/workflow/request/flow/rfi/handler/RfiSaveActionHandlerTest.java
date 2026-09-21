package uk.gov.mrtm.api.workflow.request.flow.rfi.handler;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.rfi.domain.RfiSaveRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RfiQuestionPayload;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RfiSubmitPayload;

@ExtendWith(MockitoExtension.class)
class RfiSaveActionHandlerTest {

    @InjectMocks
    private RfiSaveActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Test
    void process() {
        final Long requestTaskId = 1L;
        final UUID attachmentId = UUID.randomUUID();
        final LocalDate deadline = LocalDate.of(2024, 1, 15);
        final RfiQuestionPayload questionPayload = RfiQuestionPayload.builder()
                .questions(List.of("question"))
                .build();
        final VirRequestPayload requestPayload = VirRequestPayload.builder().build();
        final VirApplicationReviewRequestTaskPayload taskPayload = VirApplicationReviewRequestTaskPayload.builder()
                .rfiAttachments(Map.of(attachmentId, "file.pdf"))
                .build();
        final RequestTask requestTask = RequestTask.builder()
                .id(requestTaskId)
                .payload(taskPayload)
                .request(Request.builder().payload(requestPayload).build())
                .build();
        final RfiSaveRequestTaskActionPayload actionPayload = RfiSaveRequestTaskActionPayload.builder()
                .rfiSubmitPayload(RfiSubmitPayload.builder()
                        .rfiQuestionPayload(questionPayload)
                        .deadline(deadline)
                        .build())
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        handler.process(requestTaskId, MrtmRequestTaskActionType.RFI_SAVE, AppUser.builder().build(), actionPayload);

        assertThat(requestPayload.getRfiData().getRfiQuestionPayload()).isEqualTo(questionPayload);
        assertThat(requestPayload.getRfiData().getRfiDeadline()).isEqualTo(deadline);
        assertThat(requestPayload.getRfiData().getRfiAttachments()).containsEntry(attachmentId, "file.pdf");
        verify(requestTaskService, times(1)).findTaskById(requestTaskId);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).isEqualTo(List.of(MrtmRequestTaskActionType.RFI_SAVE));
    }
}
