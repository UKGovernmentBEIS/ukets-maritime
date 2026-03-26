package uk.gov.mrtm.api.integration.external.verification.domain.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExternalUncorrectedItem extends ExternalVerifierComment {

    @NotNull
    @Schema(description = "Indicates if there is a material effect on the total emissions reported")
    private Boolean materialEffect;
}
