package uk.gov.mrtm.api.web.controller.account;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.hibernate.validator.HibernateValidator;
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
import org.springframework.mock.web.MockServletContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.context.support.GenericWebApplicationContext;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryCreationDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryDTO;
import uk.gov.mrtm.api.account.domain.dto.AccountReportingStatusHistoryListResponse;
import uk.gov.mrtm.api.account.enumeration.MrtmAccountReportingStatus;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryCreationService;
import uk.gov.mrtm.api.account.service.reportingstatus.AccountReportingStatusHistoryQueryService;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.mrtm.api.web.controller.utils.TestConstrainValidatorFactory;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AccountReportingStatusHistoryControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/accounts/reporting-status";

    @InjectMocks
    private AccountReportingStatusHistoryController controller;

    @Mock
    private AccountReportingStatusHistoryQueryService accountReportingStatusQueryService;

    @Mock
    private AccountReportingStatusHistoryCreationService accountReportingStatusCreationService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        AuthorizationAspectUserResolver authorizationAspectUserResolver =
                new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedAspect aspect = new AuthorizedAspect(appUserAuthorizationService, authorizationAspectUserResolver);

        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(aspect);

        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (AccountReportingStatusHistoryController) aopProxy.getProxy();

        LocalValidatorFactoryBean validatorFactoryBean = mockValidatorFactoryBean();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setValidator(validatorFactoryBean)
                .build();

        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
    }

    private LocalValidatorFactoryBean mockValidatorFactoryBean() {
        LocalValidatorFactoryBean validatorFactoryBean = new LocalValidatorFactoryBean();
        MockServletContext servletContext = new MockServletContext();
        GenericWebApplicationContext context = new GenericWebApplicationContext(servletContext);

        context.refresh();
        validatorFactoryBean.setApplicationContext(context);
        TestConstrainValidatorFactory constraintValidatorFactory = new TestConstrainValidatorFactory(context);
        validatorFactoryBean.setConstraintValidatorFactory(constraintValidatorFactory);
        validatorFactoryBean.setProviderClass(HibernateValidator.class);
        validatorFactoryBean.afterPropertiesSet();
        return validatorFactoryBean;
    }

    @Test
    void getReportingStatusHistory() throws Exception {
        Long accountId = 1L;
        LocalDateTime submissionDate = LocalDateTime.now();
        Map<Year, List<AccountReportingStatusHistoryDTO>> historyList
                = Map.of(Year.now(), List.of(AccountReportingStatusHistoryDTO.builder()
                .status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT)
                .reason("reason")
                .submitterName("submitterName")
                .submissionDate(submissionDate)
                .build()));
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();
        AccountReportingStatusHistoryListResponse reportingStatusHistory = AccountReportingStatusHistoryListResponse.builder()
                .reportingStatusHistoryList(historyList)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(accountReportingStatusQueryService.getReportingStatusHistoryListResponse(accountId))
                .thenReturn(reportingStatusHistory);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/history")
                        .param("accountId", String.valueOf(accountId))
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(1))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.reportingStatusHistoryList.*[0].status")
                        .value(MrtmAccountReportingStatus.REQUIRED_TO_REPORT.name()))
                .andExpect(jsonPath("$.reportingStatusHistoryList.*[0].reason")
                        .value("reason"))
                .andExpect(jsonPath("$.reportingStatusHistoryList.*[0].submitterName")
                        .value("submitterName"));

        verify(accountReportingStatusQueryService, times(1))
                .getReportingStatusHistoryListResponse(accountId);
    }

    @Test
    void getReportingStatusHistory_forbidden() throws Exception {
        Long accountId = 1L;
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .roleType(RoleTypeConstants.VERIFIER)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(appUser, "getReportingStatusHistory", String.valueOf(accountId), null, null);

        mockMvc.perform(MockMvcRequestBuilders.get(CONTROLLER_PATH + "/history")
                        .param("accountId", String.valueOf(accountId))
                        .param("page", String.valueOf(0))
                        .param("size", String.valueOf(1))
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(accountReportingStatusQueryService);
    }

    @Test
    void submitReportingStatus() throws Exception {
        Long accountId = 1L;
        Year year = Year.now();
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();

        final AccountReportingStatusHistoryCreationDTO reportingStatusCreationDTO =
                AccountReportingStatusHistoryCreationDTO.builder().status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT).reason("reason").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post(CONTROLLER_PATH + "/" + accountId + "/" + year)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(reportingStatusCreationDTO)))
                .andExpect(status().isNoContent());

        verify(accountReportingStatusCreationService, times(1))
                .submitReportingStatus(accountId, reportingStatusCreationDTO, year, appUser);
    }

    @Test
    void submitReportingStatus_forbidden() throws Exception {
        Long accountId = 1L;
        Year year = Year.now();
        AppUser appUser = AppUser.builder()
                .userId("authUserId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .build();

        final AccountReportingStatusHistoryCreationDTO reportingStatusCreationDTO =
                AccountReportingStatusHistoryCreationDTO.builder().status(MrtmAccountReportingStatus.REQUIRED_TO_REPORT).reason("reason").build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(appUserAuthorizationService)
                .authorize(appUser, "submitReportingStatus", String.valueOf(accountId), null, null);

        mockMvc.perform(
                        MockMvcRequestBuilders
                                .post(CONTROLLER_PATH + "/" + accountId + "/" + year)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(reportingStatusCreationDTO)))
                .andExpect(status().isForbidden());

        verify(accountReportingStatusCreationService, never())
                .submitReportingStatus(accountId, reportingStatusCreationDTO, year, appUser);
    }
}
