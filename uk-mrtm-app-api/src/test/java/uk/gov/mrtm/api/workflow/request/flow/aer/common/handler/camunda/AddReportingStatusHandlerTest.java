package uk.gov.mrtm.api.workflow.request.flow.aer.common.handler.camunda;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryCreationService;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

import java.time.Year;
import java.util.Date;
import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AddReportingStatusHandlerTest {

    @InjectMocks
    private AddReportingStatusHandler handler;

    @Mock
    private AccountReportingStatusHistoryCreationService accountReportingStatusHistoryCreationService;

    @Mock
    private RequestService requestService;

    @Test
    public void execute() throws Exception {
        DelegateExecution execution = mock(DelegateExecution.class);
        String requestId = "request-id";
        Date expirationDate = new Date();
        Long accountId = 123L;
        Year year = Year.of(2020);
        Request request = Request.builder()
            .id(requestId)
            .requestResources(List.of(RequestResource.builder()
                .resourceType(ResourceType.ACCOUNT)
                .resourceId(String.valueOf(accountId))
                .build()))
            .metadata(AerRequestMetadata.builder()
                .year(year)
                .build())
            .build();

        when(execution.getVariable(BpmnProcessConstants.REQUEST_ID)).thenReturn(requestId);
        when(requestService.findRequestById(requestId)).thenReturn(request);

        handler.execute(execution);

        verify(accountReportingStatusHistoryCreationService)
            .submitReportingStatus(accountId, null, "SYSTEM", year);
        verify(requestService).findRequestById(requestId);
        verifyNoMoreInteractions(requestService,  accountReportingStatusHistoryCreationService);
    }
}
