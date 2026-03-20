package uk.gov.mrtm.api.integration.external.verification.domain.common;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class ExternalVerifierComment {

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Give as much detail as possible, including: the nature and size of the non-compliance and which element of the non-compliance it relates to")
    private String explanation;
}
