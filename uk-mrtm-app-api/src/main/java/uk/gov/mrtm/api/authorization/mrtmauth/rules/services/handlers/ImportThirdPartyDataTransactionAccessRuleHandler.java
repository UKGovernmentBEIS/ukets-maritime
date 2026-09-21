package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.repository.ImportThirdPartyDataJobRepository;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.Set;

@Service("importThirdPartyDataTransactionAccessRuleHandler")
@RequiredArgsConstructor
public class ImportThirdPartyDataTransactionAccessRuleHandler implements AuthorizationResourceRuleHandler {

    private final ImportThirdPartyDataJobRepository jobRepository;

    /**
     * @param user the authenticated user
     * @param authorizationRules the list of
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     *
     * Authorizes access on {@link uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ImportThirdPartyDataTransactionEntity} by transaction ID
     * with id the {@code resourceId}
     */
    @Override
    public void evaluateRules(@Valid Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId) {
        boolean exists = jobRepository.existsByTransactionIdAndAccountIds(Long.parseLong(resourceId), user.getAccounts());

        if (!exists) {
            throw new BusinessException(ErrorCode.FORBIDDEN);
        }
    }

}
