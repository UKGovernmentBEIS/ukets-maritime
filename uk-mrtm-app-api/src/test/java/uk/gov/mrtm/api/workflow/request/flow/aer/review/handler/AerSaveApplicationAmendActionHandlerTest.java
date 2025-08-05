package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSaveApplicationAmendRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.service.RequestAerApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AerSaveApplicationAmendActionHandlerTest {

    @InjectMocks
    private AerSaveApplicationAmendActionHandler saveApplicationAmendActionHandler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private RequestAerApplyService aerApplyService;

    @Test
    void process() {
        Long requestTaskId = 1L;
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).build();
        AerSaveApplicationAmendRequestTaskActionPayload taskActionPayload =
            AerSaveApplicationAmendRequestTaskActionPayload.builder().build();
        AppUser user = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        //invoke
        saveApplicationAmendActionHandler
            .process(requestTaskId, MrtmRequestTaskActionType.AER_SAVE_APPLICATION_AMEND, user, taskActionPayload);

        //verify
        verify(requestTaskService).findTaskById(requestTaskId);
        verify(aerApplyService).applySaveAction(taskActionPayload, requestTask);
        verifyNoMoreInteractions(requestTaskService, aerApplyService);
    }

    @Test
    void getTypes() {
        assertThat(saveApplicationAmendActionHandler.getTypes())
            .containsOnly(MrtmRequestTaskActionType.AER_SAVE_APPLICATION_AMEND);
    }
}