package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
public class EmpIssuanceSendRegistryAccountOpeningEventRequestActionPayload extends RequestActionPayload {

    @NotBlank
    private String businessId;

    @NotBlank
    private String imoNumber;

    @NotBlank
    private String name;

    @NotNull
    private LocalDate firstMaritimeActivityDate;

    @NotNull
    private CompetentAuthorityEnum competentAuthority;

    @NotNull
    private OrganisationStructure organisationStructure;
}
