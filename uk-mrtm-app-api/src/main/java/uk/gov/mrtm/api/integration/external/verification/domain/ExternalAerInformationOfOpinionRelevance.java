package uk.gov.mrtm.api.integration.external.verification.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.verification.AerAccreditationReferenceDocumentType;
import uk.gov.netz.api.common.validation.SpELExpression;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@SpELExpression(expression = "{(#accreditationReferenceDocumentTypes?.contains('OTHER')) == (#otherReference != null)}", message = "aerVerificationData.materialityLevel.otherReference")
public class ExternalAerInformationOfOpinionRelevance {

    @NotBlank
    @Size(min = 1, max = 10000)
    @Schema(description = "Materiality level")
    private String materialityDetails;

    @Builder.Default
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @NotEmpty
    @Schema(description = "Reference documents that are appropriate to the accreditation you hold")
    private Set<AerAccreditationReferenceDocumentType> accreditationReferenceDocumentTypes = new HashSet<>();

    @Size(max = 10000)
    @Schema(description = "Reference details. Required only when 'accreditationReferenceDocumentTypes' contains 'OTHER', otherwise must be omitted")
    private String otherReference;
}
