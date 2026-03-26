package uk.gov.mrtm.api.workflow.request.flow.registry.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RegistryAccountUpdatedEventSubmittedRequestActionPayload extends RequestActionPayload {

    private UpdateOperatorDetails accountDetails;
    private OrganisationStructure organisationStructure;
}
