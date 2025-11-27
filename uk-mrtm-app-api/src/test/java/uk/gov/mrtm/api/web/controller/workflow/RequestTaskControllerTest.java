package uk.gov.mrtm.api.web.controller.workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderDTO;
import uk.gov.mrtm.api.integration.external.common.service.ThirdPartyProviderViewServiceDelegator;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskDTO;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskItemDTO;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskViewService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionPayloadTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskActionProcessDTO;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandlerMapper;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;
import uk.gov.netz.api.workflow.request.flow.common.jsonprovider.RequestTaskActionPayloadCommonTypesProvider;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class RequestTaskControllerTest {

    private static final String BASE_PATH = "/v1.0/tasks";

    private MockMvc mockMvc;

    @InjectMocks
    private RequestTaskController requestTaskController;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private RequestTaskViewService requestTaskViewService;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RequestTaskActionHandlerMapper requestTaskActionHandlerMapper;

    @Mock
    private RequestTaskActionHandler<RequestTaskActionEmptyPayload> requestTaskActionHandler;

    @Mock
    private ThirdPartyProviderViewServiceDelegator thirdPartyProviderViewServiceDelegator;

    private ObjectMapper mapper;

    @BeforeEach
    public void setUp() {
        mapper = new ObjectMapper();
        mapper.registerSubtypes(new RequestTaskActionPayloadCommonTypesProvider().getTypes().toArray(NamedType[]::new));
        
        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
		mappingJackson2HttpMessageConverter.setObjectMapper(mapper);

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(requestTaskController);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        requestTaskController = (RequestTaskController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(requestTaskController)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setMessageConverters(mappingJackson2HttpMessageConverter)
                .build();
    }

    @Test
    void getTaskItemInfoById() throws Exception {
        AppUser user = AppUser.builder().firstName("fn").lastName("ln").build();
        String requestTaskType = "DUMMY_REQUEST_TYPE_APPLICATION_REVIEW";
        Long requestTaskId = 1L;
        RequestTaskItemDTO taskItem = createTaskItem(requestTaskId, requestTaskType);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(requestTaskViewService.getTaskItemInfo(requestTaskId, user)).thenReturn(taskItem);
        mockMvc.perform(
                        MockMvcRequestBuilders.get(BASE_PATH + "/" + requestTaskId)
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestTask.type").value(requestTaskType))
                .andExpect(jsonPath("$.requestTask.id").value(requestTaskId));

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestTaskViewService, times(1)).getTaskItemInfo(requestTaskId, user);
    }

    @Test
    void getTaskItemInfoById_forbidden() throws Exception {
        AppUser user = AppUser.builder().firstName("fn").lastName("ln").build();
        long requestTaskId = 1L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(user, "getTaskItemInfoById", String.valueOf(requestTaskId), null, null);

        mockMvc.perform(
                        MockMvcRequestBuilders.get(BASE_PATH + "/" + requestTaskId)
                                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(appSecurityComponent, times(1)).getAuthenticatedUser();
        verify(requestTaskViewService, never()).getTaskItemInfo(anyLong(), any());
    }

    @Test
    void processRequestTaskAction() throws Exception {
        AppUser appUser = AppUser.builder().userId("id").build();
        RequestTaskActionEmptyPayload dismissPayload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();
        RequestTaskActionProcessDTO requestTaskActionProcessDTO = RequestTaskActionProcessDTO.builder()
                .requestTaskId(1L)
                .requestTaskActionType("REQUEST_TASK_ACTION_TYPE")
                .requestTaskActionPayload(dismissPayload)
                .build();

        final RequestTaskPayload requestTaskPayload =
            TestRequestTaskPayload.builder()
                .payloadType("PAYLOAD_TYPE")
                .property1("property1")
                .property2("property2")
                .build();

        when(requestTaskActionHandler.process(requestTaskActionProcessDTO.getRequestTaskId(),
            "REQUEST_TASK_ACTION_TYPE",
            appUser,
            (RequestTaskActionEmptyPayload) requestTaskActionProcessDTO.getRequestTaskActionPayload()))
            .thenReturn(requestTaskPayload);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(requestTaskActionHandlerMapper.get("REQUEST_TASK_ACTION_TYPE")).thenReturn(requestTaskActionHandler);

        mockMvc.perform(MockMvcRequestBuilders
                .post(BASE_PATH + "/actions")
                .content(mapper.writeValueAsString(requestTaskActionProcessDTO))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.property1").value("property1"))
            .andExpect(jsonPath("$.property2").value("property2"));

        verify(requestTaskActionHandler, times(1)).process(requestTaskActionProcessDTO.getRequestTaskId(),
            "REQUEST_TASK_ACTION_TYPE",
            appUser,
            (RequestTaskActionEmptyPayload) requestTaskActionProcessDTO.getRequestTaskActionPayload());
    }

    @Test
    void processRequestTaskAction_no_content() throws Exception {
        AppUser appUser = AppUser.builder().userId("id").build();
        RequestTaskActionEmptyPayload dismissPayload = RequestTaskActionEmptyPayload.builder()
            .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
            .build();
        RequestTaskActionProcessDTO requestTaskActionProcessDTO = RequestTaskActionProcessDTO.builder()
            .requestTaskId(1L)
            .requestTaskActionType("REQUEST_TASK_ACTION_TYPE")
            .requestTaskActionPayload(dismissPayload)
            .build();

        when(requestTaskActionHandler.process(requestTaskActionProcessDTO.getRequestTaskId(),
            "REQUEST_TASK_ACTION_TYPE",
            appUser,
            (RequestTaskActionEmptyPayload) requestTaskActionProcessDTO.getRequestTaskActionPayload()))
            .thenReturn(null);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(requestTaskActionHandlerMapper.get("REQUEST_TASK_ACTION_TYPE")).thenReturn(requestTaskActionHandler);

        mockMvc.perform(MockMvcRequestBuilders
                        .post(BASE_PATH + "/actions")
                        .content(mapper.writeValueAsString(requestTaskActionProcessDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(requestTaskActionHandler, times(1)).process(requestTaskActionProcessDTO.getRequestTaskId(),
                "REQUEST_TASK_ACTION_TYPE",
                appUser,
                (RequestTaskActionEmptyPayload) requestTaskActionProcessDTO.getRequestTaskActionPayload());
    }

    @Test
    void processRequestTaskAction_forbidden() throws Exception {
    	mapper.registerSubtypes(new RequestTaskActionPayloadCommonTypesProvider().getTypes().toArray(NamedType[]::new));
    	
        AppUser appUser = AppUser.builder().userId("id").build();
        RequestTaskActionEmptyPayload dismissPayload = RequestTaskActionEmptyPayload.builder()
                .payloadType(RequestTaskActionPayloadTypes.EMPTY_PAYLOAD)
                .build();
        RequestTaskActionProcessDTO requestTaskActionProcessDTO = RequestTaskActionProcessDTO.builder()
                .requestTaskId(1L)
                .requestTaskActionType("rtat")
                .requestTaskActionPayload(dismissPayload)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(appUser, "processRequestTaskAction", "1", null, null);

        mockMvc.perform(MockMvcRequestBuilders
                        .post(BASE_PATH + "/actions")
                        .content(mapper.writeValueAsString(requestTaskActionProcessDTO))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(requestTaskActionHandler, never()).process(anyLong(), any(), any(), any());
    }

    @Test
    void getThirdPartyDataProviderInfoByRequestId_with_content() throws Exception {
        AppUser appUser = AppUser.builder().userId("id").build();
        Long requestTaskId = 1L;
        ThirdPartyDataProviderDTO response = ThirdPartyDataProviderDTO.builder()
            .providerName("provider name")
            .build();

        when(thirdPartyProviderViewServiceDelegator.getThirdPartyDataProviderInfo(requestTaskId))
            .thenReturn(response);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH + "/"+ requestTaskId +"/third-party-data-provider-info")
                .param("id", requestTaskId.toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.providerName").value(response.getProviderName()));

        verify(thirdPartyProviderViewServiceDelegator).getThirdPartyDataProviderInfo(requestTaskId);
    }

    @Test
    void getThirdPartyDataProviderInfoByRequestId_no_content() throws Exception {
        AppUser appUser = AppUser.builder().userId("id").build();
        Long requestTaskId = 1L;

        when(thirdPartyProviderViewServiceDelegator.getThirdPartyDataProviderInfo(requestTaskId)).thenReturn(null);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(MockMvcRequestBuilders
                .get(BASE_PATH + "/"+ requestTaskId +"/third-party-data-provider-info")
                .param("id", requestTaskId.toString())
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(thirdPartyProviderViewServiceDelegator).getThirdPartyDataProviderInfo(requestTaskId);
    }

    private RequestTaskItemDTO createTaskItem(Long taskid, String type) {
        return RequestTaskItemDTO.builder()
                .requestTask(RequestTaskDTO.builder()
                        .type(type)
                        .id(taskid)
                        .build())
                .allowedRequestTaskActions(List.of())
                .userAssignCapable(false)
                .build();
    }


}
