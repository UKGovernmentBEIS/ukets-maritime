package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum DoeEmissionsCalculationApproachType {

    EUROCONTROL_SUPPORT_FACILITY("data from the Eurocontrol Support Facility"),
    VERIFIED_ANNUAL_EMISSIONS_REPORT_SUBMITTED_LATE("a verified emissions report that was not submitted in accordance with Article 33 of the Order"),
    OTHER_DATASOURCE(null)
    ;

    private final String description;
}
