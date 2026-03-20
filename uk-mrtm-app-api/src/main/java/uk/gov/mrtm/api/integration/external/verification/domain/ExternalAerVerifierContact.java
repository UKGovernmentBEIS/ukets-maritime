package uk.gov.mrtm.api.integration.external.verification.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExternalAerVerifierContact {

    @NotBlank
    @Size(min = 1, max = 500)
    @Schema(description = "Verifier contact name")
    private String name;

    @Email
    @Size(min = 1, max = 255)
    @NotBlank
    @Schema(description = "Verifier contact email")
    private String email;

    @NotBlank
    @Size(min = 1, max = 255)
    @Schema(description = "Verifier contact telephone number")
    private String phoneNumber;
}
