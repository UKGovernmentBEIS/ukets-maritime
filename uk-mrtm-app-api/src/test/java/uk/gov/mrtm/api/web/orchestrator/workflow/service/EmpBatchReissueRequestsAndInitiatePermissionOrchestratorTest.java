package uk.gov.mrtm.api.web.orchestrator.workflow.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.web.orchestrator.workflow.dto.EmpBatchReissuesResponseDTO;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.domain.Scope;
import uk.gov.netz.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.RequestHistoryCategory.CA;
import static uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses.COMPLETED;

@ExtendWith(MockitoExtension.class)
public class EmpBatchReissueRequestsAndInitiatePermissionOrchestratorTest {

    @InjectMocks
    private EmpBatchReissueRequestsAndInitiatePermissionOrchestrator cut;

    @Mock
    private RequestQueryService requestQueryService;

    @Mock
    private CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;


    @Test
    void findBatchReissueRequests() {

        AppUser authUser = AppUser.builder().userId("userId")
                .authorities(List.of(AppAuthority.builder().competentAuthority(CompetentAuthorityEnum.ENGLAND).build())).build();
        PagingRequest pagingRequestInfo = PagingRequest.builder().pageNumber(0).pageSize(30).build();

        RequestDetailsSearchResults requestDetailsSearchResults = RequestDetailsSearchResults.builder()
                .total(10L)
                .requestDetails(List.of(new RequestDetailsDTO("requestId", MrtmRequestType.EMP_BATCH_REISSUE, COMPLETED, LocalDateTime.now(), EmpBatchReissueRequestMetadata.builder()
                        .submitter("submitter")
                        .build())))
                .build();

        RequestSearchCriteria requestSearchCriteria = RequestSearchCriteria.builder()
        		.resourceType(ResourceType.CA)
                .resourceId(authUser.getCompetentAuthority().name())
                .historyCategory(CA)
                .requestTypes(Set.of(MrtmRequestType.EMP_BATCH_REISSUE))
                .paging(pagingRequestInfo).build();

        when(requestQueryService.findRequestDetailsBySearchCriteria(requestSearchCriteria)).thenReturn(requestDetailsSearchResults);
        when(compAuthAuthorizationResourceService.hasUserScopeOnResourceSubType(authUser,
                Scope.REQUEST_CREATE, MrtmRequestType.EMP_BATCH_REISSUE)).thenReturn(true);

        EmpBatchReissuesResponseDTO result = cut.findBatchReissueRequests(authUser, pagingRequestInfo);

        assertThat(result).isEqualTo(EmpBatchReissuesResponseDTO.builder()
                .requestDetailsSearchResults(requestDetailsSearchResults)
                .canInitiateBatchReissue(true)
                .build());

        verify(requestQueryService, times(1)).findRequestDetailsBySearchCriteria(requestSearchCriteria);
        verify(compAuthAuthorizationResourceService, times(1)).hasUserScopeOnResourceSubType(authUser,
                Scope.REQUEST_CREATE, MrtmRequestType.EMP_BATCH_REISSUE);

    }
}
