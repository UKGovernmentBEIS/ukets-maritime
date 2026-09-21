package uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportCriteriaDTO;
import uk.gov.mrtm.api.thirdpartydatamanagement.viewavailabletoimport.domain.ThirdPartyDataManagementAvailableToImportResponseDTO;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.domain.PagingRequest;

import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ThirdPartyDataManagementViewAvailableToImportServiceTest {

    @InjectMocks
    private ThirdPartyDataManagementViewAvailableToImportService service;

    @Mock
    private ThirdPartyDataManagementViewAvailableToImportQueryService thirdPartyDataManagementViewAvailableToImportQueryService;

    @Test
    void findDataAvailableToImport() {
        Long accountId = 1L;
        AppUser appUser = AppUser.builder().authorities(List.of(AppAuthority.builder().accountId(accountId).build())).build();
        PagingRequest paging = mock(PagingRequest.class);
        ThirdPartyDataManagementAvailableToImportCriteriaDTO searchCriteria = mock(ThirdPartyDataManagementAvailableToImportCriteriaDTO.class);
        ThirdPartyDataManagementAvailableToImportResponseDTO responseDTO = mock(ThirdPartyDataManagementAvailableToImportResponseDTO.class);

        when(thirdPartyDataManagementViewAvailableToImportQueryService.findDataAvailableToImport(paging, Set.of(accountId), searchCriteria)).thenReturn(responseDTO);

        ThirdPartyDataManagementAvailableToImportResponseDTO actual = service.findDataAvailableToImport(appUser, paging, searchCriteria);

        assertThat(responseDTO).isEqualTo(actual);

        verify(thirdPartyDataManagementViewAvailableToImportQueryService).findDataAvailableToImport(paging, Set.of(accountId), searchCriteria);
        verifyNoMoreInteractions(thirdPartyDataManagementViewAvailableToImportQueryService);
    }
}