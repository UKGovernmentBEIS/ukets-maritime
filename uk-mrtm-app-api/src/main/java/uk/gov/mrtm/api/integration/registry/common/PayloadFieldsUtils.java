package uk.gov.mrtm.api.integration.registry.common;

import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class PayloadFieldsUtils {

    //Account details
    public static final String EMITTER_ID = "AccountDetails.EmitterID";
    public static final String INSTALLATION_ACTIVITY_TYPE = "AccountDetails.InstallationActivityType";
    public static final String INSTALLATION_NAME = "AccountDetails.InstallationName";
    public static final String ACCOUNT_NAME = "AccountDetails.Account Name";
    public static final String PERMIT_ID = "AccountDetails.PermitID";
    public static final String EMP_ID = "AccountDetails.MonitoringPlanID";
    public static final String IMO_NUMBER = "AccountDetails.CompanyImoNumber";
    public static final String REGULATOR = "AccountDetails.Regulator";
    public static final String DATE_OF_ISSUANCE = "AccountDetails.DateOfEmpIssuance";
    public static final String FIRST_YEAR_OF_VERIFIED_EMISSIONS = "AccountDetails.FirstYearOfVerifiedEmission";

    //Account Holder
    public static final String ACCOUNT_HOLDER_NAME = "AccountHolder.Name";
    public static final String ACCOUNT_HOLDER_TYPE = "AccountHolder.AccountHolderType";
    public static final String ADDRESS_LINE_1 = "AccountHolder.AddressLine1";
    public static final String ADDRESS_LINE_2 = "AccountHolder.AddressLine2";
    public static final String CITY = "AccountHolder.TownOrCity";
    public static final String STATE = "AccountHolder.StateOrProvince";
    public static final String COUNTRY = "AccountHolder.Country";
    public static final String POSTCODE = "AccountHolder.PostalCode";
    public static final String CRN_NOT_EXIST = "AccountHolder.CrnNotExists";
    public static final String CRN = "AccountHolder.CompanyRegistrationNumber";
    public static final String CRN_JUSTIFICATION = "AccountHolder.CrnJustification";

    // Set operator
    public static final String OPERATOR_ID = "OperatorID";

    // Updated emissions
    public static final String YEAR = "Year";
    public static final String EMISSIONS = "Emissions";
    public static final String REGISTRY_ID = "Registry ID";

    public static String asStringOrEmpty(Object obj) {
        return Optional.ofNullable(obj).map(Object::toString).filter(s -> !s.isBlank()).orElse("[empty]");
    }

    public static final String EMPTY = "[empty]";
}
