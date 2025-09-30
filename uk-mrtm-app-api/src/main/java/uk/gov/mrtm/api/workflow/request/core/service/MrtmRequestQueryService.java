package uk.gov.mrtm.api.workflow.request.core.service;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestHistoryCategory;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestSearchCriteria;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

@Service
@RequiredArgsConstructor
public class MrtmRequestQueryService {

    private final RequestQueryService requestQueryService;

    public RequestDetailsSearchResults findRequestDetailsBySearchCriteria(@Valid RequestSearchCriteria criteria, AppUser appUser) {
        validateRoleHasAccessToHistoryCategory(criteria.getHistoryCategory(), appUser.getRoleType());
        return this.requestQueryService.findRequestDetailsBySearchCriteria(criteria);
    }

    private void validateRoleHasAccessToHistoryCategory(String historyCategoryValue, String roleType) {
        MrtmRequestHistoryCategory historyCategory = MrtmRequestHistoryCategory.valueOf(historyCategoryValue);

        if (!historyCategory.getAccessibleRoles().contains(roleType)) {
            throw new BusinessException(MrtmErrorCode.ROLE_NOT_ALLOWED_FOR_HISTORY_CATEGORY);
        }
    }
}