package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoePopulateRequestMetadataWithReportableEmissionsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoePopulateRequestMetadataWithReportableEmissionsHandlerTest {

    @InjectMocks
    private DoePopulateRequestMetadataWithReportableEmissionsHandler handler;

    @Mock
    private DoePopulateRequestMetadataWithReportableEmissionsService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        String requestId = "1";
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        handler.execute(execution);

        verify(execution, times(1)).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(service, times(1)).updateRequestMetadata(requestId);
    }
}
