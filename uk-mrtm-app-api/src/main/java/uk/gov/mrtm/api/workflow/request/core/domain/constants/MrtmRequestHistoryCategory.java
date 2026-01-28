package uk.gov.mrtm.api.workflow.request.core.domain.constants;


import lombok.AllArgsConstructor;
import lombok.Getter;
import uk.gov.netz.api.common.constants.RoleTypeConstants;

import java.util.List;

@Getter
@AllArgsConstructor
public enum MrtmRequestHistoryCategory {
    PERMIT(List.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER, RoleTypeConstants.REGULATOR)),
    REPORTING(List.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER, RoleTypeConstants.REGULATOR)),
    SYSTEM_MESSAGE_NOTIFICATION(List.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER, RoleTypeConstants.REGULATOR)),
    NON_COMPLIANCE(List.of(RoleTypeConstants.REGULATOR)),
    CA(List.of(RoleTypeConstants.REGULATOR));

    private final List<String> accessibleRoles;
}
