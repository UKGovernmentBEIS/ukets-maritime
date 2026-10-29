package uk.gov.mrtm.api.web.controller.requestfeedback;

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
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackCompletionMethod;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerFeedbackReviewGroups;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.FeedbackEaseRating;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.MrtmRequestFeedbackType;
import uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider.RequestFeedbackPayloadTypesProvider;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackDetailsDTO;
import uk.gov.netz.api.request.feedback.service.RequestFeedbackService;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;

import java.util.Set;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestFeedbackPayloadType.AER_SUBMIT_PAYLOAD;

@ExtendWith(MockitoExtension.class)
class RequestFeedbackControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/request-feedback";

    @InjectMocks
    private RequestFeedbackController controller;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private RequestFeedbackService requestFeedbackService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (RequestFeedbackController) aopProxy.getProxy();
        objectMapper = new ObjectMapper();
        objectMapper.registerSubtypes(new RequestFeedbackPayloadTypesProvider().getTypes().toArray(NamedType[]::new));

        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();
        mappingJackson2HttpMessageConverter.setObjectMapper(objectMapper);

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .setMessageConverters(mappingJackson2HttpMessageConverter)
            .build();
    }

    @Test
    void getRequestFeedbackDetails() throws Exception {
        AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.REGULATOR)
            .build();
        String requestId = "1";
        MrtmRequestFeedbackType type = MrtmRequestFeedbackType.AER_SUBMIT;
        long feedbackId = 10L;
        RequestFeedbackDetailsDTO response = RequestFeedbackDetailsDTO.builder().id(feedbackId).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(requestFeedbackService.getRequestFeedbackDetails(requestId, type)).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "?requestId=1&type=AER_SUBMIT")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("id").value(feedbackId));

        verify(requestFeedbackService).getRequestFeedbackDetails(requestId, type);
        verifyNoMoreInteractions(requestFeedbackService);
    }

    @Test
    void getRequestFeedbackDetails_forbidden() throws Exception {
        final AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.OPERATOR)
            .build();
        String requestId = "1";
        String type = MrtmRequestFeedbackType.AER_SUBMIT.name();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "getRequestFeedbackDetails", requestId, null, type);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "?requestId=1&type=AER_SUBMIT")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verifyNoInteractions(requestFeedbackService);
    }

    @Test
    void submitRequestFeedback() throws Exception {
        AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.REGULATOR)
            .build();
        String requestId = "1";
        MrtmRequestFeedbackType type = MrtmRequestFeedbackType.AER_SUBMIT;
        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .payloadType(AER_SUBMIT_PAYLOAD)
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .feedbackReviewGroups(Set.of(AerFeedbackReviewGroups.OPERATOR_DETAILS))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additionalComments")
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post(CONTROLLER_PATH + "?requestId=1&type=AER_SUBMIT")
            .content(objectMapper.writeValueAsString(payload))
            .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(requestFeedbackService).submitRequestFeedback(requestId, type, payload, user);
        verifyNoMoreInteractions(requestFeedbackService);
    }

    @Test
    void submitRequestFeedback_forbidden() throws Exception {
        final AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.OPERATOR)
            .build();
        String requestId = "1";
        String type = MrtmRequestFeedbackType.AER_SUBMIT.name();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "submitRequestFeedback", requestId, null, type);

        AerSubmitRequestFeedbackPayload payload = AerSubmitRequestFeedbackPayload.builder()
            .payloadType(AER_SUBMIT_PAYLOAD)
            .reportCompletionEaseRating(FeedbackEaseRating.EASY)
            .reportCompletionMethods(Set.of(AerFeedbackCompletionMethod.TYPED_INTO_FORM_SECTIONS))
            .feedbackReviewGroups(Set.of(AerFeedbackReviewGroups.OPERATOR_DETAILS))
            .feedbackReviewGroupsComment("feedbackReviewGroupsComment")
            .additionalComments("additionalComments")
            .build();

        mockMvc.perform(MockMvcRequestBuilders.post(CONTROLLER_PATH + "?requestId=1&type=AER_SUBMIT")
                .content(objectMapper.writeValueAsString(payload))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verifyNoInteractions(requestFeedbackService);
    }
}
