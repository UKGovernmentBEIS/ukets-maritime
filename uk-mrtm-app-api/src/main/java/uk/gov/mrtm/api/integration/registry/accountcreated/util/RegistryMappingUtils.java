package uk.gov.mrtm.api.integration.registry.accountcreated.util;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.LimitedCompanyOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;

import java.util.List;

@UtilityClass
public class RegistryMappingUtils {

    private static final String GB = "GB";
    private static final String GB_ENG = "GB-ENG";
    private static final String GB_NIR = "GB-NIR";
    private static final String GB_SCT = "GB-SCT";
    private static final String GB_WLS = "GB-WLS";
    private static final String UK = "UK";

    private static final String ORGANISATION = "ORGANISATION";

    public static String mapWithRegistryCountryCodes(String countryCode) {
        return List.of(GB, GB_ENG, GB_NIR, GB_SCT, GB_WLS).contains(countryCode) ? UK : countryCode;
    }

    public static String mapCrnJustification(OrganisationStructure organisationStructure) {
        if (organisationStructure.getLegalStatusType().equals(OrganisationLegalStatusType.PARTNERSHIP)) {
            return OrganisationLegalStatusType.PARTNERSHIP.getDescription();
        }
        return null;
    }

    public static String mapCompanyRegistrationNumber(OrganisationStructure organisationStructure) {
        if (organisationStructure.getLegalStatusType().equals(OrganisationLegalStatusType.LIMITED_COMPANY)) {
            return ((LimitedCompanyOrganisation) organisationStructure).getRegistrationNumber();
        }
        return null;
    }

    public static String mapAccountHolderType(OrganisationLegalStatusType legalStatusType) {
        return OrganisationLegalStatusType.INDIVIDUAL.equals(legalStatusType) ? OrganisationLegalStatusType.INDIVIDUAL.name() :
                ORGANISATION;
    }
}
