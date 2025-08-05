package uk.gov.mrtm.api.workflow.request.flow.registry.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.time.Year;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class RegistryUpdatedEmissionsEventSubmittedRequestActionPayload extends RequestActionPayload {

    private Long registryId;
    private Long reportableEmissions;
    private Year reportingYear;
}
