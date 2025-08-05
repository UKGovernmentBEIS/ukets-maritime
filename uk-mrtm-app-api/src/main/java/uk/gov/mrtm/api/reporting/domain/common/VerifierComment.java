package uk.gov.mrtm.api.reporting.domain.common;

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
public class VerifierComment {

    @NotBlank
    @Size(max = 10000)
    private String reference;

    @NotBlank
    @Size(max = 10000)
    private String explanation;
}
