package uk.gov.mrtm.api.web.controller.thirdPartyDataProvider;

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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.Validator;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderCreateDTO;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderDTO;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProvidersResponseDTO;
import uk.gov.netz.api.thirdpartydataprovider.service.ThirdPartyDataProviderOrchestrator;
import uk.gov.netz.api.thirdpartydataprovider.service.ThirdPartyDataProviderService;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataProviderControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/third-party-data-provider";

    private MockMvc mockMvc;

    @InjectMocks
    private ThirdPartyDataProviderController controller;

    private ObjectMapper mapper;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private ThirdPartyDataProviderService thirdPartyDataProviderService;

    @Mock
    private ThirdPartyDataProviderOrchestrator thirdPartyDataProviderOrchestrator;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private Validator validator;

    @BeforeEach
    public void setUp() {

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect authorizedAspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);
        AuthorizedRoleAspect authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);
        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(authorizedAspect);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);
        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (ThirdPartyDataProviderController) aopProxy.getProxy();
        mapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .setValidator(validator)
            .build();
    }

    @Test
    void createThirdPartyDataProvider() throws Exception {
        String name = "name";
        ThirdPartyDataProviderCreateDTO providerDTO = ThirdPartyDataProviderCreateDTO.builder()
            .name(name)
            .build();

        final AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.REGULATOR)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post(CONTROLLER_PATH)
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(providerDTO)))
            .andExpect(status().isNoContent());

        verify(thirdPartyDataProviderOrchestrator).createThirdPartyDataProvider(user, providerDTO);
        verify(appSecurityComponent).getAuthenticatedUser();
        verifyNoMoreInteractions(thirdPartyDataProviderOrchestrator, appSecurityComponent);
        verifyNoMoreInteractions(thirdPartyDataProviderService);
    }

    @Test
    void getAllThirdPartyDataProviders() throws Exception {
        String clientId = "clientId";
        String name = "name";
        long id = 1L;
        ThirdPartyDataProviderDTO providerDTO = ThirdPartyDataProviderDTO.builder()
            .clientId(clientId)
            .name(name)
            .id(id)
            .build();
        ThirdPartyDataProvidersResponseDTO responseDTO = ThirdPartyDataProvidersResponseDTO.builder()
            .thirdPartyDataProviders(List.of(providerDTO))
            .build();

        final AppUser user = AppUser.builder()
            .roleType(RoleTypeConstants.REGULATOR)
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(thirdPartyDataProviderService.getAllThirdPartyDataProviders(user))
            .thenReturn(responseDTO);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH).contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.thirdPartyDataProviders[0].id").value(id))
            .andExpect(jsonPath("$.thirdPartyDataProviders[0].name").value(name))
            .andExpect(jsonPath("$.thirdPartyDataProviders[0].clientId").value(clientId));

        verify(thirdPartyDataProviderService).getAllThirdPartyDataProviders(user);
        verify(appSecurityComponent).getAuthenticatedUser();
        verifyNoMoreInteractions(thirdPartyDataProviderService, appSecurityComponent);
        verifyNoMoreInteractions(thirdPartyDataProviderOrchestrator);
    }
}