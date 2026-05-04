package uk.gov.mrtm.api.web.controller.verificationbody;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderNameInfoDTO;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderAppointService;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderService;
import uk.gov.netz.api.verificationbody.service.thirdpartydataprovider.VerificationBodyThirdPartyDataProviderUnappointService;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class VerificationBodyThirdPartyDataProviderControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/verification-bodies";

    private MockMvc mockMvc;

    @InjectMocks
    private VerificationBodyThirdPartyDataProviderController controller;

    @Mock
    private VerificationBodyThirdPartyDataProviderService verificationBodyThirdPartyDataProviderService;
    @Mock
    private VerificationBodyThirdPartyDataProviderAppointService verificationBodyThirdPartyDataProviderAppointService;
    @Mock
    private VerificationBodyThirdPartyDataProviderUnappointService verificationBodyThirdPartyDataProviderUnappointService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (VerificationBodyThirdPartyDataProviderController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void getThirdPartyDataProviderNameInfoByVerificationBody() throws Exception {
        Long verificationBodyId = 1L;
        Long thirdPartyDataProviderId = 2L;
        String thirdPartyDataProviderName = "provider";
        ThirdPartyDataProviderNameInfoDTO provider = ThirdPartyDataProviderNameInfoDTO.builder().id(thirdPartyDataProviderId).name(thirdPartyDataProviderName).build();
        AppUser user = AppUser.builder().userId("userId").authorities(List.of(AppAuthority.builder().verificationBodyId(verificationBodyId).build())).build();

        when(verificationBodyThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByVerificationBody(verificationBodyId))
            .thenReturn(Optional.of(provider));
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(thirdPartyDataProviderId))
            .andExpect(jsonPath("$.name").value(thirdPartyDataProviderName));

        verify(verificationBodyThirdPartyDataProviderService, times(1)).getThirdPartyDataProviderNameInfoByVerificationBody(verificationBodyId);
    }

    @Test
    void getThirdPartyDataProviderOfVerificationBodyById() throws Exception {
        Long verificationBodyId = 1L;
        Long thirdPartyDataProviderId = 2L;
        String thirdPartyDataProviderName = "provider";
        ThirdPartyDataProviderNameInfoDTO provider = ThirdPartyDataProviderNameInfoDTO.builder().id(thirdPartyDataProviderId).name(thirdPartyDataProviderName).build();
        AppUser user = AppUser.builder().userId("userId").build();

        when(verificationBodyThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByVerificationBody(verificationBodyId))
            .thenReturn(Optional.of(provider));
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/" + verificationBodyId + "/third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(thirdPartyDataProviderId))
            .andExpect(jsonPath("$.name").value(thirdPartyDataProviderName));

        verify(verificationBodyThirdPartyDataProviderService, times(1)).getThirdPartyDataProviderNameInfoByVerificationBody(verificationBodyId);
    }

    @Test
    void getAllThirdPartyDataProviders() throws Exception {
        Long thirdPartyDataProviderId = 2L;
        String thirdPartyDataProviderName = "provider";
        ThirdPartyDataProviderNameInfoDTO provider = ThirdPartyDataProviderNameInfoDTO.builder().id(thirdPartyDataProviderId).name(thirdPartyDataProviderName).build();
        List<ThirdPartyDataProviderNameInfoDTO> providers = List.of(provider);
        AppUser user = AppUser.builder().userId("userId").build();

        when(verificationBodyThirdPartyDataProviderService.getAllThirdPartyDataProviders())
            .thenReturn(providers);
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/third-party-data-providers")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(thirdPartyDataProviderId))
            .andExpect(jsonPath("$[0].name").value(thirdPartyDataProviderName));

        verify(verificationBodyThirdPartyDataProviderService, times(1)).getAllThirdPartyDataProviders();
    }

    @Test
    void appointThirdPartyDataProviderToVerificationBody() throws Exception {
        Long verificationBodyId = 1L;
        Long thirdPartyDataProviderId = 2L;
        AppUser user = AppUser.builder().userId("userId").authorities(List.of(AppAuthority.builder().verificationBodyId(verificationBodyId).build())).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .post(CONTROLLER_PATH + "/appoint-third-party-data-provider/" + thirdPartyDataProviderId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(verificationBodyThirdPartyDataProviderAppointService, times(1)).appointThirdPartyDataProviderToVerificationBody(thirdPartyDataProviderId, verificationBodyId);
    }

    @Test
    void appointThirdPartyDataProviderToVerificationBody_forbidden() throws Exception {
        Long verificationBodyId = 1L;
        Long thirdPartyDataProviderId = 2L;
        AppUser user = AppUser.builder().userId("userId").authorities(List.of(AppAuthority.builder().verificationBodyId(verificationBodyId).build())).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "appointThirdPartyDataProviderToVerificationBody");


        mockMvc.perform(
                MockMvcRequestBuilders
                    .post(CONTROLLER_PATH + "/appoint-third-party-data-provider/" + thirdPartyDataProviderId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(verificationBodyThirdPartyDataProviderAppointService, never())
            .appointThirdPartyDataProviderToVerificationBody(Mockito.anyLong(), Mockito.anyLong());
    }

    @Test
    void unappointThirdPartyDataProviderFromVerificationBody() throws Exception {
        Long verificationBodyId = 1L;
        AppUser user = AppUser.builder().userId("userId").authorities(List.of(AppAuthority.builder().verificationBodyId(verificationBodyId).build())).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .delete(CONTROLLER_PATH + "/unappoint-third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(verificationBodyThirdPartyDataProviderUnappointService, times(1)).unappointThirdPartyDataProviderFromVerificationBody(verificationBodyId);
    }

    @Test
    void unappointThirdPartyDataProviderFromVerificationBody_forbidden() throws Exception {
        Long verificationBodyId = 1L;
        AppUser user = AppUser.builder().userId("userId").authorities(List.of(AppAuthority.builder().verificationBodyId(verificationBodyId).build())).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "unappointThirdPartyDataProviderFromVerificationBody");


        mockMvc.perform(
                MockMvcRequestBuilders
                    .delete(CONTROLLER_PATH + "/unappoint-third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(verificationBodyThirdPartyDataProviderUnappointService, never())
            .unappointThirdPartyDataProviderFromVerificationBody(Mockito.anyLong());
    }

}