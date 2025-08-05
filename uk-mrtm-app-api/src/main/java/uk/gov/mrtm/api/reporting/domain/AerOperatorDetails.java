package uk.gov.mrtm.api.reporting.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationStructure;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class AerOperatorDetails {

    @NotBlank
    @Size(max = 255)
    private String operatorName;

    @NotBlank
    @Size(max = 7)
    private String imoNumber;

    @NotNull
    @Valid
    private AddressStateDTO contactAddress;

    @NotNull
    @Valid
    private OrganisationStructure organisationStructure;

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> attachments = new HashSet<>();
        if (organisationStructure != null && !ObjectUtils.isEmpty(organisationStructure.getAttachmentIds())) {
            attachments.addAll(organisationStructure.getAttachmentIds());
        }

        return Collections.unmodifiableSet(attachments);
    }

}
