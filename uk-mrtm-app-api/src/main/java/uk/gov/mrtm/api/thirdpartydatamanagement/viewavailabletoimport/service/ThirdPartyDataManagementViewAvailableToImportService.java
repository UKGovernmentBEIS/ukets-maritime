package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.domain.PagingRequest;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementViewAvailableToImportService {

    private final ThirdPartyDataManagementViewAvailableToImportQueryService thirdPartyDataManagementViewAvailableToImportQueryService;

    public ThirdPartyDataManagementAvailableToImportResponseDTO findDataAvailableToImport(
        AppUser appUser, PagingRequest paging,
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria) {

        Set<Long> accountIds = appUser.getAccounts();
        return thirdPartyDataManagementViewAvailableToImportQueryService.findDataAvailableToImport(paging, accountIds, searchCriteria);
    }

}
