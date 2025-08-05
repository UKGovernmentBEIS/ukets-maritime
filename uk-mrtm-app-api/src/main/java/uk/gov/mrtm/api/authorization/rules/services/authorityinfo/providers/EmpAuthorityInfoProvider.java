package uk.gov.mrtm.api.authorization.rules.services.authorityinfo.providers;

public interface EmpAuthorityInfoProvider {
    Long getEmpAccountById(String id);
}
