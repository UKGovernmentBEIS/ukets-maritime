package uk.gov.mrtm.api.authorization.rules.services.handlers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.authorization.rules.services.authorityinfo.providers.EmpAuthorityInfoProvider;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.AuthorizationRuleScopePermission;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.authorization.rules.services.authorization.AppAuthorizationService;
import uk.gov.netz.api.authorization.rules.services.authorization.AuthorizationCriteria;
import uk.gov.netz.api.common.constants.RoleTypeConstants;

import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpAccessRuleHandlerTest {
    private static final String ACCOUNT_ID = "1";

    @InjectMocks
    private EmpAccessRuleHandler empAccessRuleHandler;

    @Mock
    private EmpAuthorityInfoProvider empAuthorityInfoProvider;

    @Mock
    private AppAuthorizationService appAuthorizationService;

    private final AppUser USER = AppUser.builder().roleType(RoleTypeConstants.OPERATOR).build();

    @Test
    void single_rule() {
        AuthorizationRuleScopePermission authorizationRulePermissionScope1 =
            AuthorizationRuleScopePermission.builder()
                .build();

        when(empAuthorityInfoProvider.getEmpAccountById(ACCOUNT_ID)).thenReturn(Long.valueOf(ACCOUNT_ID));

        empAccessRuleHandler.evaluateRules(Set.of(authorizationRulePermissionScope1), USER, ACCOUNT_ID);

        AuthorizationCriteria authorizationCriteria = AuthorizationCriteria.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, ACCOUNT_ID))
            .build();
        verify(appAuthorizationService).authorize(USER, authorizationCriteria);
        verify(empAuthorityInfoProvider).getEmpAccountById(ACCOUNT_ID);
        verifyNoMoreInteractions(appAuthorizationService, empAuthorityInfoProvider);
    }
}