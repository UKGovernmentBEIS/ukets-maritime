package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionMonitoringPlanSection;
import uk.gov.netz.api.common.validation.uniqueelements.UniqueElements;

import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpEmissions implements EmissionMonitoringPlanSection {

    @Builder.Default
    @Valid
    @NotEmpty
    @JsonDeserialize(as = LinkedHashSet.class)
    @UniqueElements
    private Set<@NotNull @Valid EmpShipEmissions> ships = new HashSet<>();

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {

        final Set<UUID> attachments = new HashSet<>();
        if (ships != null) {
            ships.forEach(ship -> {
                if (ship != null
                    && ship.getCarbonCapture() != null
                    && Boolean.TRUE.equals(ship.getCarbonCapture().getExist())
                    && ship.getCarbonCapture().getTechnologies() != null
                    && !ObjectUtils.isEmpty(ship.getCarbonCapture().getTechnologies().getFiles())) {

                    attachments.addAll(ship.getCarbonCapture().getTechnologies().getFiles());
                }
            });
        }
        return Collections.unmodifiableSet(attachments);
    }
}
