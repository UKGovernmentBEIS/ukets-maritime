package uk.gov.mrtm.api.web.controller.thirdPartyDataProvider;

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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.domain.ThirdPartyDataManagementImportRequestDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportInitiatorService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service.ThirdPartyDataManagementViewAvailableToImportService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactionjobs.service.ThirdPartyDataManagementViewTransactionDetailsService;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.domain.ThirdPartyDataManagementTransactionsResponseDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewtransactions.service.ThirdPartyDataManagementViewTransactionsService;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.services.AppUserAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedAspect;
import uk.gov.netz.api.security.AuthorizedRoleAspect;

import java.time.Year;
import java.util.List;
import java.util.Set;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementControllerTest {

    private static final String CONTROLLER_PATH = "/v1.0/third-party-data-management";

    @InjectMocks
    private ThirdPartyDataManagementController controller;


    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private AppUserAuthorizationService appUserAuthorizationService;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private ThirdPartyDataManagementViewAvailableToImportService thirdPartyDataManagementViewAvailableToImportService;
    @Mock
    private ThirdPartyDataManagementViewTransactionsService thirdPartyDataManagementViewTransactionsService;
    @Mock
    private ThirdPartyDataManagementViewTransactionDetailsService thirdPartyDataManagementViewTransactionDetailsService;
    @Mock
    private ThirdPartyDataManagementImportInitiatorService thirdPartyDataManagementImportInitiatorService;

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
        controller = (ThirdPartyDataManagementController) aopProxy.getProxy();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
            .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
            .setControllerAdvice(new ExceptionControllerAdvice())
            .build();
    }

    @Test
    void findDataAvailableToImport() throws Exception {
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria = ThirdPartyDataManagementAvailableToImportCriteriaDTO.builder()
            .requestType(ThirdPartyDataRequestType.AER)
            .year(Year.of(2020))
            .build();
        int page = 1;
        int pageSize = 10;
        ThirdPartyDataManagementAvailableToImportResponseDTO responseDTO = mock(ThirdPartyDataManagementAvailableToImportResponseDTO.class);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(thirdPartyDataManagementViewAvailableToImportService.findDataAvailableToImport(appUser,
            PagingRequest.builder().pageNumber(page).pageSize(pageSize).build(), searchCriteria
        )).thenReturn(responseDTO);

        mockMvc.perform(
                MockMvcRequestBuilders.get(CONTROLLER_PATH + "/available-to-import?page=1&size=10&requestType=AER&year=2020")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(thirdPartyDataManagementViewAvailableToImportService).findDataAvailableToImport(appUser,
            PagingRequest.builder().pageNumber(page).pageSize(pageSize).build(), searchCriteria
        );
        verifyNoMoreInteractions(thirdPartyDataManagementViewAvailableToImportService);
        verifyNoInteractions(thirdPartyDataManagementViewTransactionsService,
            thirdPartyDataManagementViewTransactionDetailsService,
            thirdPartyDataManagementImportInitiatorService);
    }

    @Test
    void findImportTransactions() throws Exception {
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();
        int page = 1;
        int pageSize = 10;
        ThirdPartyDataManagementTransactionsResponseDTO responseDTO = mock(ThirdPartyDataManagementTransactionsResponseDTO.class);

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);
        when(thirdPartyDataManagementViewTransactionsService.findImportTransactions(appUser,
            PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdOn"))
        )).thenReturn(responseDTO);

        mockMvc.perform(
                MockMvcRequestBuilders.get(CONTROLLER_PATH + "/transactions?page=1&size=10")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(thirdPartyDataManagementViewTransactionsService).findImportTransactions(appUser,
            PageRequest.of(page, pageSize, Sort.by(Sort.Direction.DESC, "createdOn")));
        verifyNoMoreInteractions(thirdPartyDataManagementViewTransactionsService);
        verifyNoInteractions(thirdPartyDataManagementViewAvailableToImportService,
            thirdPartyDataManagementViewTransactionDetailsService,
            thirdPartyDataManagementImportInitiatorService);
    }

    @Test
    void initiateImport() throws Exception {
        AppUser appUser = AppUser.builder().userId("authUserId").roleType(RoleTypeConstants.OPERATOR).build();
        ThirdPartyDataManagementImportRequestDTO requestDTO = ThirdPartyDataManagementImportRequestDTO.builder()
            .requestType(ThirdPartyDataRequestType.AER)
            .year(Year.of(2020))
            .items(Set.of(1L))
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .post(CONTROLLER_PATH + "/import")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(requestDTO)))
            .andExpect(status().isNoContent());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(thirdPartyDataManagementImportInitiatorService).initiateImport(appUser, requestDTO);
        verifyNoMoreInteractions(thirdPartyDataManagementImportInitiatorService);
        verifyNoInteractions(thirdPartyDataManagementViewAvailableToImportService,
            thirdPartyDataManagementViewTransactionDetailsService,
            thirdPartyDataManagementViewTransactionsService);
    }

    @Test
    void findImportTransactionDetails() throws Exception {
        long transactionId = 2L;
        AppUser appUser = AppUser.builder()
            .userId("authUserId")
            .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.SCOTLAND).build()))
            .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(appUser);

        mockMvc.perform(
                MockMvcRequestBuilders
                    .get(CONTROLLER_PATH + "/transaction-details/2")
                    .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk());

        verify(appSecurityComponent).getAuthenticatedUser();
        verify(thirdPartyDataManagementViewTransactionDetailsService).findImportTransactionDetails(appUser, transactionId);
        verifyNoMoreInteractions(thirdPartyDataManagementViewTransactionDetailsService);
        verifyNoInteractions(thirdPartyDataManagementViewAvailableToImportService,
            thirdPartyDataManagementImportInitiatorService,
            thirdPartyDataManagementViewTransactionsService);
    }
}
