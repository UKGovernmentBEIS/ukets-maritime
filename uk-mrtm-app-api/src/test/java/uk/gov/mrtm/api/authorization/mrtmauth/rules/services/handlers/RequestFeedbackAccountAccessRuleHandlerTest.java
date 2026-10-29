package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.authorityinfo.dto.RequestAuthorityInfoDTO;
import uk.gov.netz.api.authorization.rules.services.authorityinfo.dto.ResourceAuthorityInfo;
import uk.gov.netz.api.authorization.rules.services.authorityinfo.providers.RequestAuthorityInfoProvider;
import uk.gov.netz.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;

import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestFeedbackAccountAccessRuleHandlerTest {

    @InjectMocks
    private RequestFeedbackAccountAccessRuleHandler handler;

    @Mock
    private AppAuthorizationService appAuthorizationService;
    @Mock
    private RequestAuthorityInfoProvider requestAuthorityInfoProvider;

    @Test
    void evaluateRules() {
        String permission = "PERMISSION";
        AuthorizationRuleScopePermission authorizationRulePermissionScope = AuthorizationRuleScopePermission.builder()
            .permission(permission)
            .build();
        AppUser user = mock(AppUser.class);
        String accountId = "2";
        String resourceId = "request-id";
        Map<String, String> requestResources = Map.of(
            ResourceType.CA, "1",
            ResourceType.ACCOUNT, accountId,
            ResourceType.VERIFICATION_BODY, "3");
        RequestAuthorityInfoDTO requestInfoDTO = RequestAuthorityInfoDTO.builder()
            .authorityInfo(ResourceAuthorityInfo.builder().requestResources(requestResources).build())
            .build();

        when(requestAuthorityInfoProvider.getRequestInfo(resourceId)).thenReturn(requestInfoDTO);

        handler.evaluateRules(Set.of(authorizationRulePermissionScope), user, resourceId);

        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId))
            .permission(permission)
            .build();

        verify(appAuthorizationService).authorize(user, authorizationCriteria);
        verify(requestAuthorityInfoProvider).getRequestInfo(resourceId);

        verifyNoMoreInteractions(appAuthorizationService, requestAuthorityInfoProvider);
    }
}