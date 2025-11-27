package uk.gov.mrtm.api.web.controller.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountCreateService;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;
import uk.gov.netz.api.account.domain.dto.AccountSearchCriteria;
import uk.gov.netz.api.account.domain.dto.AccountSearchResultInfoDTO;
import uk.gov.netz.api.account.domain.dto.AccountSearchResults;
import uk.gov.netz.api.account.service.AccountSearchServiceDelegator;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.OPERATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.REGULATOR;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.VERIFIER;

@ExtendWith(MockitoExtension.class)
class MrtmAccountControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/mrtm/accounts";
    private static final String IMO_NUMBER_CONTROLLER_PATH = "/imo-number/";

    private static final String ACCOUNT_NAME = "accountName";
    private static final String IMO_NUMBER = "0000000";

    @InjectMocks
    private MrtmAccountController controller;

    @Mock
    private MrtmAccountCreateService mrtmAccountCreateService;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private AccountSearchServiceDelegator accountSearchServiceDelegator;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

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
        controller = (MrtmAccountController) aopProxy.getProxy();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .build();
    }

    @Test
    void createMmrtmAccount() throws Exception {
        final AddressStateDTO addressStateDTO = AddressStateDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .country("country")
                .postcode("postcode")
                .state("state")
                .build();
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
                .build();
        MrtmAccountDTO accountCreationDTO = MrtmAccountDTO.builder()
                .name(ACCOUNT_NAME)
                .imoNumber(IMO_NUMBER)
                .address(addressStateDTO)
                .firstMaritimeActivityDate(LocalDate.of(2026, 4, 26))
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                        MockMvcRequestBuilders.post(CONTROLLER_PATH)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(accountCreationDTO)))
                .andExpect(status().isCreated());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(mrtmAccountCreateService).createMaritimeAccount(accountCreationDTO, appUser);
    }

    @Test
    void createMrtmAccount_forbidden() throws Exception {
        final AddressStateDTO addressStateDTO = AddressStateDTO.builder()
                .line1("line1")
                .line2("line2")
                .city("city")
                .country("country")
                .postcode("postcode")
                .state("state")
                .build();
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .roleType(RoleTypeConstants.OPERATOR)
                .build();
        MrtmAccountDTO accountCreationDTO = MrtmAccountDTO.builder()
                .name(ACCOUNT_NAME)
                .imoNumber(IMO_NUMBER)
                .address(addressStateDTO)
                .firstMaritimeActivityDate(LocalDate.of(2026, 4, 26))
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(appUser, new String[]{ RoleTypeConstants.REGULATOR });

        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post(CONTROLLER_PATH)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(accountCreationDTO)))
                .andExpect(status().isForbidden());

        verifyNoInteractions(mrtmAccountCreateService);
    }

    @Test
    void isExistingAccountImoNumber() throws Exception {
        AppUser user = AppUser.builder().userId("userId").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + IMO_NUMBER_CONTROLLER_PATH + IMO_NUMBER)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(mrtmAccountQueryService).isExistingAccountImoNumber(IMO_NUMBER);
    }

    @Test
    void isExistingAccountImoNumber_forbidden() throws Exception {
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .roleType(RoleTypeConstants.OPERATOR)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(appUser, new String[]{ RoleTypeConstants.REGULATOR });


        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + IMO_NUMBER_CONTROLLER_PATH + IMO_NUMBER)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verify(appSecurityComponent).getAuthenticatedUser();
        verifyNoInteractions(mrtmAccountQueryService);
    }

    @Test
    void searchCurrentUserMrtmAccounts() throws Exception {
        final AppUser user = AppUser.builder().userId("userId").build();
        final AccountSearchCriteria criteria = AccountSearchCriteria.builder()
                .term("key")
                .paging(PagingRequest.builder().pageNumber(0).pageSize(10).build())
                .direction(Sort.Direction.ASC)
                .sortBy(AccountSearchCriteria.SortBy.ACCOUNT_BUSINESS_ID)
                .build();

        final List<AccountSearchResultInfoDTO> accounts =
                List.of(
                        new AccountSearchResultInfoDTO(1L, "account1", "EM00009", MrtmAccountStatus.LIVE),
                        new AccountSearchResultInfoDTO(2L, "account2", "EM00010", MrtmAccountStatus.LIVE)
                );
        final AccountSearchResults results = AccountSearchResults.builder().accounts(accounts).total(2L).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        when(accountSearchServiceDelegator.getAccountsByUserAndSearchCriteria(user, criteria)).thenReturn(results);

        mockMvc.perform(MockMvcRequestBuilders
                        .get(CONTROLLER_PATH)
                        .param("term", criteria.getTerm())
                        .param("page", String.valueOf(criteria.getPaging().getPageNumber()))
                        .param("size", String.valueOf(criteria.getPaging().getPageSize()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accounts[0].id").value(1L))
                .andExpect(jsonPath("$.accounts[0].name").value("account1"))
                .andExpect(jsonPath("$.accounts[0].businessId").value("EM00009"))
                .andExpect(jsonPath("$.accounts[1].id").value(2L))
                .andExpect(jsonPath("$.accounts[1].name").value("account2"))
                .andExpect(jsonPath("$.accounts[1].businessId").value("EM00010"));

        verify(accountSearchServiceDelegator).getAccountsByUserAndSearchCriteria(user, criteria);
    }

    @Test
    void searchCurrentUserMrtmAccounts_forbidden() throws Exception {
        final AppUser user = AppUser.builder().userId("userId").build();
        final AccountSearchCriteria criteria = AccountSearchCriteria.builder()
                .term("key")
                .paging(PagingRequest.builder().pageNumber(0).pageSize(10).build()).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(user);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(user, new String[]{OPERATOR, REGULATOR, VERIFIER});

        mockMvc.perform(MockMvcRequestBuilders
                        .get(CONTROLLER_PATH)
                        .param("term", criteria.getTerm())
                        .param("page", String.valueOf(criteria.getPaging().getPageNumber()))
                        .param("size", String.valueOf(criteria.getPaging().getPageSize()))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(mrtmAccountQueryService);
    }
}
