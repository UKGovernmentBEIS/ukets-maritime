package uk.gov.mrtm.api.reporting.domain.verification;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import io.swagger.v3.oas.annotations.media.DiscriminatorMapping;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Schema(
        discriminatorMapping = {
                @DiscriminatorMapping(schema = AerVerifiedSatisfactoryDecision.class, value = "VERIFIED_AS_SATISFACTORY"),
                @DiscriminatorMapping(schema = AerVerifiedSatisfactoryWithCommentsDecision.class, value = "VERIFIED_AS_SATISFACTORY_WITH_COMMENTS"),
                @DiscriminatorMapping(schema = AerNotVerifiedDecision.class, value = "NOT_VERIFIED")
        },
        discriminatorProperty = "type")
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = AerVerifiedSatisfactoryDecision.class, name = "VERIFIED_AS_SATISFACTORY"),
        @JsonSubTypes.Type(value = AerVerifiedSatisfactoryWithCommentsDecision.class, name = "VERIFIED_AS_SATISFACTORY_WITH_COMMENTS"),
        @JsonSubTypes.Type(value = AerNotVerifiedDecision.class, name = "NOT_VERIFIED")
})

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class AerVerificationDecision {

    @NotNull
    private AerVerificationDecisionType type;
}
