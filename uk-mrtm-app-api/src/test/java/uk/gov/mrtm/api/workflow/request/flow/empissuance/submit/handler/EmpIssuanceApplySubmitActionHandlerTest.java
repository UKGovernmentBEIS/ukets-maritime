package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.service.RequestEmpService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplySubmitActionHandlerTest {

    @InjectMocks
    private EmpIssuanceApplySubmitActionHandler handler;

    @Mock
    private RequestEmpService requestEmpService;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private RequestTaskService requestTaskService;

    private static Stream<Arguments> process() {
        return Stream.of(
            Arguments.of(LocalDateTime.of(2026, 1, 1, 0, 0), true, true),
            Arguments.of(LocalDateTime.of(2026, 1, 1, 0, 0), false, true),
            Arguments.of(LocalDateTime.of(2026, 8, 1, 0, 0), true, false),
            Arguments.of(LocalDateTime.of(2026, 8, 1, 0, 0), false, true)
        );
    }

    @ParameterizedTest
    @MethodSource
    void process(LocalDateTime creationDate, boolean empIssuancePaymentIsActive, boolean skipPayment)
        throws NoSuchFieldException, IllegalAccessException {

        Field empIssuancePaymentIsActiveField = EmpIssuanceApplySubmitActionHandler.class.getDeclaredField("empIssuancePaymentIsActive");
        empIssuancePaymentIsActiveField.setAccessible(true);
        empIssuancePaymentIsActiveField.set(handler, empIssuancePaymentIsActive);

        Field empPaymentSkipBeforeDateField = EmpIssuanceApplySubmitActionHandler.class.getDeclaredField("empPaymentSkipBeforeDate");
        empPaymentSkipBeforeDateField.setAccessible(true);
        empPaymentSkipBeforeDateField.set(handler, LocalDateTime.of(2026, 7, 1, 0, 0));

        Long requestTaskId = 1L;
        String processTaskId = "processTaskId";
        Request request = Request.builder().id("requestId").creationDate(creationDate).build();
        RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .payload(expectedRequestTaskPayload)
            .request(request)
            .processTaskId(processTaskId)
            .build();
        RequestTaskActionEmptyPayload emptyPayload = RequestTaskActionEmptyPayload.builder().payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD).build();
        AppUser user = AppUser.builder().build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTaskId,
            MrtmRequestTaskActionType.EMP_ISSUANCE_SUBMIT_APPLICATION, user, emptyPayload);

        assertNotNull(request.getSubmissionDate());
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(requestEmpService).applySubmitAction(requestTask, user);
        verify(workflowService).completeTask(requestTask.getProcessTaskId(), Map.of(BpmnProcessConstants.SKIP_PAYMENT, skipPayment));
        verifyNoMoreInteractions(requestEmpService, requestTaskService);
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsOnly(MrtmRequestTaskActionType.EMP_ISSUANCE_SUBMIT_APPLICATION);
    }
}
