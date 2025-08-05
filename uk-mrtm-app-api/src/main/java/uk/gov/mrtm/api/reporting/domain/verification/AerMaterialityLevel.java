package uk.gov.mrtm.api.reporting.domain.verification;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{(#accreditationReferenceDocumentTypes?.contains('OTHER')) == (#otherReference != null)}", message = "aerVerificationData.materialityLevel.otherReference")
public class AerMaterialityLevel {

    @NotBlank
    @Size(max = 10000)
    private String materialityDetails;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotEmpty
    private Set<AerAccreditationReferenceDocumentType> accreditationReferenceDocumentTypes = new HashSet<>();

    @Size(max = 10000)
    private String otherReference;
}
