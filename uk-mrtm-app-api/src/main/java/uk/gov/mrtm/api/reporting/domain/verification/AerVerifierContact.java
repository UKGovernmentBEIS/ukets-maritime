package uk.gov.mrtm.api.reporting.domain.verification;

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
public class AerVerifierContact {

    @NotBlank
    @Size(max = 500)
    private String name;

    @Email
    @Size(max = 255)
    @NotBlank
    private String email;

    @NotBlank
    @Size(max = 255)
    private String phoneNumber;
}
