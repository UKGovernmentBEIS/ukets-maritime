package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.AuthorizationResourceRuleHandler;
import uk.gov.netz.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.netz.api.authorization.rules.services.authorityinfo.providers.RequestAuthorityInfoProvider;
import uk.gov.netz.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.Map;
import java.util.Set;

@Service("requestFeedbackAccountAccessHandler")
@RequiredArgsConstructor
public class RequestFeedbackAccountAccessRuleHandler implements AuthorizationResourceRuleHandler {

    private final AppAuthorizationService appAuthorizationService;
    private final RequestAuthorityInfoProvider requestAuthorityInfoProvider;


    /**
     * @param user the authenticated user
     * @param authorizationRules the list of
     * @param resourceId the resourceId for which the rules apply.
     * @throws BusinessException {@link ErrorCode} FORBIDDEN if authorization fails.
     *
     * Authorizes operator access on {@link uk.gov.netz.api.request.feedback.domain.RequestFeedback} by request ID
     * with id the {@code resourceId} and permission of the rule.
     */
    @Override
    public void evaluateRules(@Valid Set<AuthorizationRuleScopePermission> authorizationRules, AppUser user, String resourceId) {
        RequestAuthorityInfoDTO requestInfoDTO = requestAuthorityInfoProvider.getRequestInfo(resourceId);

        authorizationRules.forEach(rule -> {
            AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
                .requestResources(requestInfoDTO.getAuthorityInfo().getRequestResources())
                .requestResources(Map.of(ResourceType.ACCOUNT, requestInfoDTO.getAuthorityInfo().getRequestResources().get(ResourceType.ACCOUNT)))
                .permission(rule.getPermission())
                .build();
            appAuthorizationService.authorize(user, authorizationCriteria);
        });
    }
}
