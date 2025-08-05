package uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum OrganisationLegalStatusType {
    
    LIMITED_COMPANY("Company"),
    INDIVIDUAL("Individual"),
    PARTNERSHIP("Partnership")
    ;

    private final String description;
    
}
