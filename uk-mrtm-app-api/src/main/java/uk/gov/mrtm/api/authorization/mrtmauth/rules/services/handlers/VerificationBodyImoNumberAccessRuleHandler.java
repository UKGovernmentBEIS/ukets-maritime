package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.netz.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.Map;
import java.util.Set;

@Service("verificationBodyImoNumberAccessHandler")
@RequiredArgsConstructor
public class VerificationBodyImoNumberAccessRuleHandler implements AuthorizationResourceRuleHandler {
    private final AppAuthorizationService appAuthorizationService;
    private final MrtmAccountQueryService mrtmAccountQueryService;

    /**
     * @param user the authenticated user
     * @param authorizationRules the list of
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     *
     * Authorizes access on {@link uk.gov.netz.api.verificationbody.domain.VerificationBody} by IMO number
     * with id the {@code resourceId} and permission of the rule. If account has no verification body assigned,
     * FORBIDDEN error is thrown.
     */
    @Override
    public void evaluateRules(@Valid Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId) {
        final Long verificationBodyId = mrtmAccountQueryService.findVerificationBodyIdByImoNumber(resourceId)
            .orElseThrow(() -> new BusinessException(ErrorCode.FORBIDDEN));

        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                    .requestResources(Map.of(ResourceType.VERIFICATION_BODY, verificationBodyId.toString()))
                    .permission(rule.getPermission())
                    .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }

}
