package uk.gov.mrtm.api.web.orchestrator.workflow.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.web.orchestrator.workflow.dto.EmpBatchReissuesResponseDTO;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestHistoryCategory;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.domain.Scope;
import uk.gov.netz.api.authorization.rules.services.resource.CompAuthAuthorizationResourceService;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueRequestsAndInitiatePermissionOrchestrator {

    private final RequestQueryService requestQueryService;
    private final CompAuthAuthorizationResourceService compAuthAuthorizationResourceService;

    public EmpBatchReissuesResponseDTO findBatchReissueRequests(AppUser authUser, PagingRequest pagingRequestInfo) {

        final RequestDetailsSearchResults requestDetailsSearchResults = requestQueryService.findRequestDetailsBySearchCriteria(RequestSearchCriteria.builder()
                .resourceType(ResourceType.CA)
        		.resourceId(authUser.getCompetentAuthority().name())
                .requestTypes(Set.of(MrtmRequestType.EMP_BATCH_REISSUE))
                .historyCategory(MrtmRequestHistoryCategory.CA.name())
                .paging(pagingRequestInfo)
                .build());
        final boolean canInitiateBatchReissue = compAuthAuthorizationResourceService.hasUserScopeOnResourceSubType(authUser,
                Scope.REQUEST_CREATE, MrtmRequestType.EMP_BATCH_REISSUE);

        return EmpBatchReissuesResponseDTO.builder()
                .requestDetailsSearchResults(requestDetailsSearchResults)
                .canInitiateBatchReissue(canInitiateBatchReissue)
                .build();
    }
}
