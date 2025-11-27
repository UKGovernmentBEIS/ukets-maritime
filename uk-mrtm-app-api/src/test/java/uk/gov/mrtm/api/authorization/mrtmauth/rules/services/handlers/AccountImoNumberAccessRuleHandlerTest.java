package uk.gov.mrtm.api.authorization.mrtmauth.rules.services.handlers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.core.domain.Permission;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.netz.api.common.constants.RoleTypeConstants;

import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AccountImoNumberAccessRuleHandlerTest {


    @InjectMocks
    private AccountImoNumberAccessRuleHandler accountAccessRuleHandler;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    @Mock
    private MrtmAccountQueryService mrtmAccountQueryService;

    private final AppUser USER = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).build();

    @Test
    void single_rule() {
        String imoNumber = "1234567";
        Long accountId = 1L;

        AuthorizationRuleScopePermission authorizationRulePermissionScope1 =
            AuthorizationRuleScopePermission.builder()
                .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
                .build();

        when(mrtmAccountQueryService.getAccountIdByImoNumber(imoNumber)).thenReturn(accountId);

        accountAccessRuleHandler.evaluateRules(Set.of(authorizationRulePermissionScope1), USER, imoNumber);

        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
            .build();
        verify(mrtmAccountQueryService).getAccountIdByImoNumber(imoNumber);
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria);

        verifyNoMoreInteractions(mrtmAccountQueryService, appAuthorizationService);
    }

    @Test
    void multiple_rules() {
        String imoNumber = "1234567";
        Long accountId = 1L;

        AuthorizationRuleScopePermission authorizationRulePermissionScope1 =
            AuthorizationRuleScopePermission.builder()
                .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
                .build();

        AuthorizationRuleScopePermission authorizationRulePermissionScope2 =
            AuthorizationRuleScopePermission.builder()
                .permission(Permission.PERM_CA_USERS_EDIT)
                .build();

        when(mrtmAccountQueryService.getAccountIdByImoNumber(imoNumber)).thenReturn(accountId);

        accountAccessRuleHandler.evaluateRules(Set.of(authorizationRulePermissionScope1, authorizationRulePermissionScope2), USER, imoNumber);

        AuthorizationCriteria authorizationCriteria1 = AuthorizationCriteria.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .permission(Permission.PERM_ACCOUNT_USERS_EDIT)
            .build();
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria1);

        AuthorizationCriteria authorizationCriteria2 = AuthorizationCriteria.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .permission(Permission.PERM_CA_USERS_EDIT)
            .build();
        verify(appAuthorizationService, times(1)).authorize(USER, authorizationCriteria2);
        verify(mrtmAccountQueryService).getAccountIdByImoNumber(imoNumber);
        verifyNoMoreInteractions(mrtmAccountQueryService, appAuthorizationService);
    }
}
