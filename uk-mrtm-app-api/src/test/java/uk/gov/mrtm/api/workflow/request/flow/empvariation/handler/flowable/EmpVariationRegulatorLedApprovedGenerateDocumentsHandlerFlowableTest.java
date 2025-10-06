package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler.flowable;

import org.flowable.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRegulatorLedApprovedGenerateDocumentsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationRegulatorLedApprovedGenerateDocumentsHandlerFlowableTest {

    @InjectMocks
    private EmpVariationRegulatorLedApprovedGenerateDocumentsHandlerFlowable cut;

    @Mock
    private EmpVariationRegulatorLedApprovedGenerateDocumentsService service;

    @Mock
    private DelegateExecution execution;

    @Test
    void execute() throws Exception {
        String requestId = "1";
        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);

        cut.execute(execution);

        verify(execution).getVariable(BpmnProcessConstants.REQUEST_ID);
        verify(service).generateDocuments(requestId);
        verifyNoMoreInteractions(service);
    }
}