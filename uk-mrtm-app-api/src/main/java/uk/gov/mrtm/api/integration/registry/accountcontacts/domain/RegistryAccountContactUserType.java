package uk.gov.mrtm.api.integration.registry.accountcontacts.domain;

import lombok.Getter;
import uk.gov.netz.api.common.exception.BusinessException;

import java.util.Arrays;

import static uk.gov.mrtm.api.common.exception.MrtmErrorCode.INTEGRATION_REGISTRY_ACCOUNT_CONTACTS_INVALID_ROLE;

public enum RegistryAccountContactUserType {

    OPERATOR_ADMIN("operator_admin"),
    OPERATOR("operator"),
    CONSULTANT_AGENT("consultant_agent"),
    EMITTER("emitter_contact");

    @Getter
    private final String roleCode;

    RegistryAccountContactUserType(String roleCode) {
        this.roleCode = roleCode;
    }

    public static RegistryAccountContactUserType fromRoleCode(String roleCode) {
        return Arrays.stream(RegistryAccountContactUserType.values())
            .filter(ca -> ca.getRoleCode().equals(roleCode))
            .findFirst()
            .orElseThrow(() -> new BusinessException(INTEGRATION_REGISTRY_ACCOUNT_CONTACTS_INVALID_ROLE));
    }
}
