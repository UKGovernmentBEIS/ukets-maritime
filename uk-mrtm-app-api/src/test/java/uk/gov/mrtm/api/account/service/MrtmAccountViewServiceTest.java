package uk.gov.mrtm.api.account.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountEmpDTO;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountViewDTO;
import uk.gov.mrtm.api.account.transform.MrtmAccountMapper;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmAccountViewServiceTest {

    @InjectMocks
    private MrtmAccountViewService mrtmAccountViewService;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    @Mock
    private EmissionsMonitoringPlanQueryService empQueryService;

    @Mock
    private MrtmAccountMapper mrtmAccountMapper;

    @Test
    void getMaritimeAccount() {
        Long accountId = 1L;
        MrtmAccountViewDTO mrtmAccountViewDTO = mock(MrtmAccountViewDTO.class);
        final EmpDetailsDTO empDetailsDTO = mock(EmpDetailsDTO.class);
        MrtmAccountEmpDTO expectedResponse = MrtmAccountEmpDTO.builder()
                .account(mrtmAccountViewDTO)
                .emp(empDetailsDTO)
                .build();

        when(mrtmAccountQueryService.getAccountDTOByIdAndUser(accountId)).thenReturn(mrtmAccountViewDTO);
        when(empQueryService.getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId)).thenReturn(Optional.of(empDetailsDTO));

        MrtmAccountEmpDTO response = mrtmAccountViewService.getMaritimeAccount(accountId);

        assertEquals(expectedResponse, response);
        verify(mrtmAccountQueryService).getAccountDTOByIdAndUser(accountId);
        verify(empQueryService).getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId);

        verifyNoMoreInteractions(mrtmAccountQueryService,empQueryService,mrtmAccountMapper);
    }

    @Test
    void getMaritimeAccount_no_emp_details() {
        Long accountId = 1L;
        MrtmAccountViewDTO mrtmAccountViewDTO = mock(MrtmAccountViewDTO.class);
        MrtmAccountEmpDTO expectedResponse = MrtmAccountEmpDTO.builder()
                .account(mrtmAccountViewDTO)
                .build();

        when(mrtmAccountQueryService.getAccountDTOByIdAndUser(accountId)).thenReturn(mrtmAccountViewDTO);
        when(empQueryService.getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId)).thenReturn(Optional.empty());

        MrtmAccountEmpDTO response = mrtmAccountViewService.getMaritimeAccount(accountId);

        assertEquals(expectedResponse, response);
        verify(mrtmAccountQueryService).getAccountDTOByIdAndUser(accountId);
        verify(empQueryService).getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId);

        verifyNoMoreInteractions(mrtmAccountQueryService,empQueryService,mrtmAccountMapper);
    }
}
