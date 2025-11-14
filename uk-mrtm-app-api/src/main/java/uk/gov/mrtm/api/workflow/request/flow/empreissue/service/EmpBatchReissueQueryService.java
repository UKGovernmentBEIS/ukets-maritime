package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.mrtm.api.account.domain.dto.MrtmAccountIdAndNameDTO;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpAccountDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EmpBatchReissueQueryService {

    private final MrtmAccountQueryService mrtmAccountQueryService;
    private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
    private final RequestService requestService;

    public boolean existAccountsByCA(CompetentAuthorityEnum ca) {
        return !mrtmAccountQueryService.getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE)).isEmpty(); // TODO use count query
    }

    public Map<Long, EmpReissueAccountDetails> findAccountsByCA(CompetentAuthorityEnum ca){
        final Map<Long, MrtmAccountIdAndNameDTO> accountDetails = mrtmAccountQueryService.getAllByCAAndStatuses(ca, Set.of(MrtmAccountStatus.LIVE))
                .stream().collect(Collectors.toMap(MrtmAccountIdAndNameDTO::getAccountId,
                        Function.identity()));

        final Map<Long, EmpAccountDTO> empAccounts = emissionsMonitoringPlanQueryService.getEmpAccountsByAccountIds(accountDetails.keySet());

        return accountDetails.entrySet().stream().collect(Collectors.toMap(Map.Entry::getKey, e -> {
            final MrtmAccountIdAndNameDTO accountInfo = accountDetails.get(e.getKey());
            final EmpAccountDTO empInfo = empAccounts.get(e.getKey());

            return EmpReissueAccountDetails.builder()
                    .empId(empInfo.getEmpId())
                    .accountName(accountInfo.getAccountName())
                    .build();
        }));
    }
    
	public long getNumberOfAccountsCompleted(String batchRequestId) {
		final Request batchRequest = requestService.findRequestById(batchRequestId);
		final EmpBatchReissueRequestMetadata metadata = (EmpBatchReissueRequestMetadata) batchRequest.getMetadata();
		return metadata.getAccountsReports()
				.values().stream()
				.filter(report -> report.getSucceeded() != null)
				.count();
	}
}
