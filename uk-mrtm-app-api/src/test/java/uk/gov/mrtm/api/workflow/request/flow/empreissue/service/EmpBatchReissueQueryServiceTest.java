package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountIdAndNameDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpAccountDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpAccountDTOImpl;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.MrtmAccountIdAndNameDTOImpl;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpBatchReissueQueryServiceTest {

	@InjectMocks
	private EmpBatchReissueQueryService cut;

	@Mock
	private MrtmAccountQueryService mrtmAccountQueryService;
	
	@Mock
	private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	
	@Test
	void existAccountsByCA() {
		CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
		
		Set<MrtmAccountIdAndNameDTO> accounts = Set.of(
				MrtmAccountIdAndNameDTOImpl.builder().accountId(1L).accountName("acc1").build(),
				MrtmAccountIdAndNameDTOImpl.builder().accountId(2L).accountName("acc2").build()
				);
		
		when(mrtmAccountQueryService.getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE))).thenReturn(accounts);
		
		boolean result = cut.existAccountsByCA(ca);
		
		assertThat(result).isTrue();
		
		verify(mrtmAccountQueryService, times(1)).getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE));
		
	}
	
	@Test
	void findAccountsByCA() {
		CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
		
		Set<MrtmAccountIdAndNameDTO> accounts = Set.of(
				MrtmAccountIdAndNameDTOImpl.builder().accountId(1L).accountName("acc1").build(),
				MrtmAccountIdAndNameDTOImpl.builder().accountId(2L).accountName("acc2").build()
				);
		
		when(mrtmAccountQueryService.getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE))).thenReturn(accounts);
		
		Map<Long, EmpAccountDTO> accountEmpDetails = Map.of(
				1L, EmpAccountDTOImpl.builder().accountId(1L).empId("empId1").build(),
				2L, EmpAccountDTOImpl.builder().accountId(2L).empId("empId2").build()
				);
		
		when(emissionsMonitoringPlanQueryService.getEmpAccountsByAccountIds(Set.of(1L, 2L))).thenReturn(accountEmpDetails);
		
		Map<Long, EmpReissueAccountDetails> result = cut.findAccountsByCA(ca);
		
		assertThat(result).containsExactlyInAnyOrderEntriesOf(Map.of(
				1L, EmpReissueAccountDetails.builder().accountName("acc1").empId("empId1").build(),
				2L, EmpReissueAccountDetails.builder().accountName("acc2").empId("empId2").build()
				));
				verify(mrtmAccountQueryService, times(1)).getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE));
		verify(emissionsMonitoringPlanQueryService, times(1)).getEmpAccountsByAccountIds(Set.of(1L, 2L));
	}
}
