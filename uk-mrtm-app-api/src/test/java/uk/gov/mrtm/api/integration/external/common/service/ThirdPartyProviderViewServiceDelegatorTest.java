package uk.gov.mrtm.api.integration.external.common.service;

import org.junit.jupiter.api.Test;
import uk.gov.mrtm.api.integration.external.emp.service.EmpThirdPartyProviderViewService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

class ThirdPartyProviderViewServiceDelegatorTest {

    private final EmpThirdPartyProviderViewService empThirdPartyProviderViewService = mock(EmpThirdPartyProviderViewService.class);
    private final RequestTaskService requestTaskService = mock(RequestTaskService.class);
    private final List<ThirdPartyProviderService> thirdPartyProviderServices = Collections.singletonList(empThirdPartyProviderViewService);
    private final ThirdPartyProviderViewServiceDelegator service =
        new ThirdPartyProviderViewServiceDelegator(thirdPartyProviderServices, requestTaskService);

    @Test
    void getThirdPartyDataProviderInfo() {
        long requestTaskId = 1L;
        long accountId = 2L;
        String requestTaskType = "REQUEST_TASK_TYPE";
        Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder()
                .resourceType(ResourceType.ACCOUNT)
                .resourceId(String.valueOf(accountId))
                .build()))
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(RequestTaskType.builder().code(requestTaskType).build())
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(empThirdPartyProviderViewService.getTypes()).thenReturn(List.of(requestTaskType));

        service.getThirdPartyDataProviderInfo(requestTaskId);

        verify(requestTaskService).findTaskById(requestTaskId);
        verify(empThirdPartyProviderViewService).getTypes();
        verify(empThirdPartyProviderViewService).getThirdPartyDataProviderInfo(accountId);

        verifyNoMoreInteractions(requestTaskService, empThirdPartyProviderViewService);
    }


    @Test
    void getThirdPartyDataProviderInfo_throws_error() {
        long requestTaskId = 1L;
        long accountId = 2L;
        Request request = Request.builder()
            .requestResources(List.of(RequestResource.builder()
                .resourceType(ResourceType.ACCOUNT)
                .resourceId(String.valueOf(accountId))
                .build()))
            .build();
        RequestTask requestTask = RequestTask.builder()
            .request(request)
            .type(RequestTaskType.builder().code("REQUEST_TASK_TYPE_A").build())
            .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);
        when(empThirdPartyProviderViewService.getTypes()).thenReturn(List.of("REQUEST_TASK_TYPE_B"));


        UnsupportedOperationException exc = assertThrows(UnsupportedOperationException.class,
            () -> service.getThirdPartyDataProviderInfo(requestTaskId));

        assertEquals(exc.getMessage(), "Third party data for request task type REQUEST_TASK_TYPE_A is not supported");

        verify(requestTaskService).findTaskById(requestTaskId);
        verify(empThirdPartyProviderViewService).getTypes();

        verifyNoMoreInteractions(requestTaskService, empThirdPartyProviderViewService);
    }
}