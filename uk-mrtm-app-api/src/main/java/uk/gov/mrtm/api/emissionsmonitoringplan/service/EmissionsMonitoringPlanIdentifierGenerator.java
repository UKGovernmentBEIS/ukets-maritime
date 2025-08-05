package uk.gov.mrtm.api.emissionsmonitoringplan.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmApprovedAccountQueryService;
import uk.gov.netz.api.common.constants.StateConstants;
import uk.gov.netz.api.common.exception.BusinessException;

import static uk.gov.netz.api.common.exception.ErrorCode.RESOURCE_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class EmissionsMonitoringPlanIdentifierGenerator {

    private final MrtmApprovedAccountQueryService approvedAccountQueryService;
    private static final String MARITIME_EMP = "MA";

    public String generate(Long accountId) {

        MrtmAccount account = approvedAccountQueryService.getApprovedAccountById(accountId)
                .orElseThrow(() -> new BusinessException(RESOURCE_NOT_FOUND));

        String authorityCode = account.getCompetentAuthority().getOneLetterCode();
        String accountIdFormatted = String.format("%05d", accountId);

        return String.format("%s-%s-%s-%s", StateConstants.UK, authorityCode, MARITIME_EMP, accountIdFormatted);
    }
}
