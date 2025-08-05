package uk.gov.mrtm.api.web.controller.workflow;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.testcontainers.shaded.com.google.common.net.HttpHeaders;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateType;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.domain.PreviewDocumentRequest;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.PreviewDocumentHandlerDelegator;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;

import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class PreviewDocumentControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/document-preview";

    private MockMvc mockMvc;

    @InjectMocks
    private PreviewDocumentController controller;

    @Mock
    private PreviewDocumentHandlerDelegator delegator;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    private ObjectMapper mapper;


    @BeforeEach
    public void setUp() {

        mapper = new ObjectMapper();

        AuthorizationAspectUserResolver authorizationAspectUserResolver =
            new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);

        controller = (PreviewDocumentController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void getDocumentPreview_success() throws Exception {

        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).build();
        final long taskId = 2L;
        final String name = "name";
        final byte[] fileContent = name.getBytes();
        final FileDTO file = FileDTO.builder()
            .fileName(name)
            .fileType("application/pdf")
            .fileContent(fileContent)
            .build();
        final PreviewDocumentRequest documentRequest = PreviewDocumentRequest.builder()
            .documentType(DocumentTemplateType.IN_RFI)
            .decisionNotification(DecisionNotification.builder()
                .signatory("signatory")
                .build())
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(delegator.getDocument(2L, documentRequest)).thenReturn(file);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders
                .post(CONTROLLER_PATH + "/" + taskId)
                .content(mapper.writeValueAsString(documentRequest))
                .contentType(MediaType.APPLICATION_JSON))
            .andReturn();

        MockHttpServletResponse response = result.getResponse();
        assertThat(response.getStatus()).isEqualTo(HttpStatus.OK.value());
        assertThat(response.getContentType()).isEqualTo(MediaType.APPLICATION_PDF.toString());
        assertThat(response.getContentAsByteArray()).isEqualTo(fileContent);
        assertThat(response.getHeader(HttpHeaders.CONTENT_DISPOSITION)).isEqualTo(
            ContentDisposition.builder("attachment").filename(name, StandardCharsets.UTF_8).build().toString());

        verify(delegator).getDocument(2L, documentRequest);
    }

    @Test
    void getDocumentPreview_forbidden() throws Exception {

        final AppUser user = AppUser.builder().roleType(RoleTypeConstants.REGULATOR).build();
        final long taskId = 2L;
        final PreviewDocumentRequest documentRequest = PreviewDocumentRequest.builder()
            .documentType(DocumentTemplateType.IN_RFI)
            .decisionNotification(DecisionNotification.builder()
                .signatory("signatory")
                .build())
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "getDocumentPreview", "2", null, null);

        mockMvc.perform(MockMvcRequestBuilders
                .post(CONTROLLER_PATH + "/" + taskId)
                .content(mapper.writeValueAsString(documentRequest))
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(delegator, never()).getDocument(2L, documentRequest);
    }
}
