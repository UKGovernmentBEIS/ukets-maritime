package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DoeAddCancelledRequestActionServiceTest {

    @InjectMocks
    private DoeAddCancelledRequestActionService service;

    @Mock
    private RequestService requestService;

    @Test
    void add() {
        final Request request = Request.builder().id("1")
                .payload(DoeRequestPayload.builder().regulatorAssignee("regulator").build()).build();

        when(requestService.findRequestById("1")).thenReturn(request);

        service.add("1");

        verify(requestService, times(1))
                .addActionToRequest(request, null, MrtmRequestActionType.DOE_APPLICATION_CANCELLED, "regulator");
    }
}
