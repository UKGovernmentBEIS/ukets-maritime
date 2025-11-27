package uk.gov.mrtm.api.web.controller.account;

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
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderAppointService;
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderService;
import uk.gov.netz.api.account.service.AccountThirdPartyDataProviderUnappointService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.thirdpartydataprovider.domain.ThirdPartyDataProviderNameInfoDTO;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AccountThirdPartyDataProviderControllerTest {


    private static final String CONTROLLER_PATH = "/v1.0/accounts";

    private MockMvc mockMvc;

    @InjectMocks
    private AccountThirdPartyDataProviderController controller;

    @Mock
    private AccountThirdPartyDataProviderService accountThirdPartyDataProviderService;

    @Mock
    private AccountThirdPartyDataProviderAppointService accountThirdPartyDataProviderAppointService;

    @Mock
    private AccountThirdPartyDataProviderUnappointService accountThirdPartyDataProviderUnappointService;

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
        controller = (AccountThirdPartyDataProviderController) aopProxy.getProxy();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void getThirdPartyDataProviderOfAccount() throws Exception {
        Long accountId = 1L;
        Long thirdPartyDataProviderId = 2L;
        String thirdPartyDataProviderName = "provider";
        ThirdPartyDataProviderNameInfoDTO provider = ThirdPartyDataProviderNameInfoDTO.builder().id(thirdPartyDataProviderId).name(thirdPartyDataProviderName).build();
        AppUser user = AppUser.builder().userId("userId").build();

        when(accountThirdPartyDataProviderService.getThirdPartyDataProviderNameInfoByAccount(accountId))
            .thenReturn(Optional.of(provider));
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/" + accountId + "/third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(thirdPartyDataProviderId))
            .andExpect(jsonPath("$.name").value(thirdPartyDataProviderName));

        verify(accountThirdPartyDataProviderService, times(1)).getThirdPartyDataProviderNameInfoByAccount(accountId);
    }

    @Test
    void getThirdPartyDataProviderOfAccount_forbidden() throws Exception {
        Long accountId = 1L;
        AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "getThirdPartyDataProviderOfAccount", Long.toString(accountId), null, null);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/" + accountId + "/third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(accountThirdPartyDataProviderService, never()).getThirdPartyDataProviderNameInfoByAccount(anyLong());
    }

    @Test
    void getAllThirdPartyDataProviders() throws Exception {
        Long accountId = 1L;
        Long thirdPartyDataProviderId = 2L;
        String thirdPartyDataProviderName = "provider";
        ThirdPartyDataProviderNameInfoDTO provider = ThirdPartyDataProviderNameInfoDTO.builder().id(thirdPartyDataProviderId).name(thirdPartyDataProviderName).build();
        List<ThirdPartyDataProviderNameInfoDTO> providers = List.of(provider);
        AppUser user = AppUser.builder().userId("userId").build();

        when(accountThirdPartyDataProviderService.getAllThirdPartyDataProviders())
            .thenReturn(providers);
        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/" + accountId + "/third-party-data-providers")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].id").value(thirdPartyDataProviderId))
            .andExpect(jsonPath("$[0].name").value(thirdPartyDataProviderName));

        verify(accountThirdPartyDataProviderService, times(1)).getAllThirdPartyDataProviders();
    }

    @Test
    void getAllThirdPartyDataProviders_forbidden() throws Exception {
        Long accountId = 1L;
        AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "getAllThirdPartyDataProviders", Long.toString(accountId), null, null);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/" + accountId + "/third-party-data-providers")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(accountThirdPartyDataProviderService, never()).getAllThirdPartyDataProviders();
    }

    @Test
    void appointThirdPartyDataProviderToAccount() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;
        Long thirdPartyDataProviderId = 2L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .post(CONTROLLER_PATH + "/" + accountId + "/appoint-third-party-data-provider/" + thirdPartyDataProviderId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(accountThirdPartyDataProviderAppointService, times(1)).appointThirdPartyDataProviderToAccount(thirdPartyDataProviderId, accountId);
    }

    @Test
    void appointThirdPartyDataProviderToAccount_forbidden() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;
        Long thirdPartyDataProviderId = 2L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "appointThirdPartyDataProviderToAccount", String.valueOf(accountId), null, null);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .post(CONTROLLER_PATH + "/" + accountId + "/appoint-third-party-data-provider/" + thirdPartyDataProviderId)
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(accountThirdPartyDataProviderAppointService, never())
            .appointThirdPartyDataProviderToAccount(Mockito.anyLong(), Mockito.anyLong());
    }

    @Test
    void unappointAccountAppointedToThirdPartyDataProvider() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .delete(CONTROLLER_PATH + "/" + accountId + "/unappoint-third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        verify(accountThirdPartyDataProviderUnappointService)
            .unappointAccountAppointedToThirdPartyDataProvider(accountId);
    }

    @Test
    void unappointAccountAppointedToThirdPartyDataProvider_forbidden() throws Exception {
        AppUser user = AppUser.builder().build();
        Long accountId = 1L;

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
            .when(appUserAuthorizationService)
            .authorize(user, "unappointThirdPartyDataProviderFromAccount", String.valueOf(accountId), null, null);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .delete(CONTROLLER_PATH + "/" + accountId + "/unappoint-third-party-data-provider")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isForbidden());

        verify(accountThirdPartyDataProviderUnappointService, never())
            .unappointAccountAppointedToThirdPartyDataProvider(accountId);
    }
}