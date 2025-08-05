package uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import lombok.Builder;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class LimitedCompanyOrganisation extends OrganisationStructure {

    @NotBlank
    @Size(max = 50)
    private String registrationNumber;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<UUID> evidenceFiles = new HashSet<>();

    @Override
    public Set<UUID> getAttachmentIds() {
        return evidenceFiles;
    }

}
