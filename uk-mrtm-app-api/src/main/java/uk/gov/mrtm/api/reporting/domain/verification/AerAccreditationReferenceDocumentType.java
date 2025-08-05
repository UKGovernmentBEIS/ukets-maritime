package uk.gov.mrtm.api.reporting.domain.verification;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AerAccreditationReferenceDocumentType {

    SI_2020_1265("The Greenhouse Gas Emissions Trading Scheme Order 2020 (SI 2020/1265)"),
    EN_ISO_14065_2020("EN ISO 14065:2020 Requirements for greenhouse gas validation and verification bodies for use in accreditation or other forms of recognition"),
    EN_ISO_14064_3_2019("EN ISO 14064-3:2019 Specification with guidance for the validation and verification of GHG assertions"),
    IAF_MD_6_2023("IAF MD 6:2023 International Accreditation Forum (IAF) Mandatory Document for the Application of ISO 14065:2020 (Issue 3, November 2023)"),
    AUTHORITY_GUIDANCE("Any guidance developed by the UK ETS Authority on verification and accreditation in relation to Maritime"),

    OTHER("Other reference");

    private final String description;
}
