package uk.gov.mrtm.api.web.controller.workflow;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.aop.aspectj.annotation.AspectJProxyFactory;
import org.springframework.aop.framework.AopProxy;
import org.springframework.aop.framework.DefaultAopProxyFactory;
import org.springframework.format.support.FormattingConversionService;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.security.web.FilterChainProxy;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import uk.gov.mrtm.api.web.config.AppUserArgumentResolver;
import uk.gov.mrtm.api.web.controller.exception.ExceptionControllerAdvice;
import uk.gov.mrtm.api.web.orchestrator.workflow.dto.EmpBatchReissuesResponseDTO;
import uk.gov.mrtm.api.web.orchestrator.workflow.service.EmpBatchReissueRequestsAndInitiatePermissionOrchestrator;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.RequestHistoryCategory;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.RoleAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.security.AppSecurityComponent;
import uk.gov.netz.api.security.AuthorizationAspectUserResolver;
import uk.gov.netz.api.security.AuthorizedRoleAspect;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static uk.gov.netz.api.common.constants.RoleTypeConstants.REGULATOR;
import static uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses.COMPLETED;

@ExtendWith(MockitoExtension.class)
public class EmpBatchReissueRequestControllerTest {

    private static final String BASE_PATH = "/v1.0/batch-reissue-requests";

    private MockMvc mockMvc;

    @InjectMocks
    private EmpBatchReissueRequestController controller;

    @Mock
    private EmpBatchReissueRequestsAndInitiatePermissionOrchestrator empBatchReissueRequestsAndInitiatePermissionOrchestrator;

    @Mock
    private RoleAuthorizationService roleAuthorizationService;

    @Mock
    private AppSecurityComponent appSecurityComponent;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;

    @BeforeEach
    public void setUp() {

        MappingJackson2HttpMessageConverter mappingJackson2HttpMessageConverter = new MappingJackson2HttpMessageConverter();

        AuthorizationAspectUserResolver authorizationAspectUserResolver = new AuthorizationAspectUserResolver(appSecurityComponent);
        AuthorizedRoleAspect
                authorizedRoleAspect = new AuthorizedRoleAspect(roleAuthorizationService, authorizationAspectUserResolver);
        AspectJProxyFactory aspectJProxyFactory = new AspectJProxyFactory(controller);
        aspectJProxyFactory.addAspect(authorizedRoleAspect);
        DefaultAopProxyFactory proxyFactory = new DefaultAopProxyFactory();
        AopProxy aopProxy = proxyFactory.createAopProxy(aspectJProxyFactory);
        controller = (EmpBatchReissueRequestController) aopProxy.getProxy();

        FormattingConversionService conversionService = new FormattingConversionService();

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new ExceptionControllerAdvice())
                .setCustomArgumentResolvers(new AppUserArgumentResolver(appSecurityComponent))
                .setMessageConverters(mappingJackson2HttpMessageConverter)
                .addFilters(new FilterChainProxy(Collections.emptyList()))
                .setConversionService(conversionService)
                .build();
    }

    @Test
    void getBatchReissueRequests() throws Exception {
        final AppUser authUser = AppUser.builder()
                .userId("userId")
                .email("a@a.a")
                .firstName("John")
                .lastName("Doe")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build()))
                .roleType(REGULATOR)
                .build();

        final EmpBatchReissuesResponseDTO response = EmpBatchReissuesResponseDTO.builder()
                .requestDetailsSearchResults(RequestDetailsSearchResults.builder()
                        .total(10L)
                        .requestDetails(List.of(
                                new RequestDetailsDTO("requestId", MrtmRequestType.EMP_BATCH_REISSUE, COMPLETED, LocalDateTime.now(), EmpBatchReissueRequestMetadata.builder()
                                        .submitter("submitter")
                                        .build())
                        )).build())
                .canInitiateBatchReissue(true)
                .build();

        RequestDetailsSearchResults results = RequestDetailsSearchResults.builder()
                .requestDetails(List.of(new RequestDetailsDTO("1", MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, LocalDateTime.now(), EmpBatchReissueRequestMetadata.builder().build())))
                .build();

        PagingRequest paging = PagingRequest.builder()
                .pageNumber(0)
                .pageSize(1)
                .build();

        RequestSearchCriteria criteria = RequestSearchCriteria.builder()
        		.resourceType(ResourceType.CA)
                .resourceId(CompetentAuthorityEnum.ENGLAND.name())
                .requestTypes(Set.of(MrtmRequestType.EMP_BATCH_REISSUE))
                .historyCategory(RequestHistoryCategory.CA)
                .paging(paging)
                .build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        when(empBatchReissueRequestsAndInitiatePermissionOrchestrator.findBatchReissueRequests(authUser, paging)).thenReturn(response);

        mockMvc.perform(MockMvcRequestBuilders.get(String.format(BASE_PATH) + "?page=0&size=1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.requestDetails[0].id").value("requestId"))
                .andExpect(jsonPath("$.total").value(10L))
                .andExpect(jsonPath("$.canInitiateBatchReissue").value(true))

        ;

        verify(empBatchReissueRequestsAndInitiatePermissionOrchestrator, times(1)).findBatchReissueRequests(authUser, paging);
    }

    @Test
    void getBatchReissueRequests_forbidden() throws Exception {
        final AppUser authUser = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).build();

        when(appSecurityComponent.getAuthenticatedUser()).thenReturn(authUser);
        doThrow(new BusinessException(ErrorCode.FORBIDDEN))
                .when(roleAuthorizationService)
                .evaluate(authUser, new String[]{REGULATOR});

        mockMvc.perform(MockMvcRequestBuilders
                        .get(String.format(BASE_PATH) + "?page=0&size=1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        verifyNoInteractions(empBatchReissueRequestsAndInitiatePermissionOrchestrator);
    }
}
