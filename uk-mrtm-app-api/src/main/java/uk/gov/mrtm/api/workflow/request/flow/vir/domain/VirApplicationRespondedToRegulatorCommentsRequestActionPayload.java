package uk.gov.mrtm.api.workflow.request.flow.vir.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.common.UncorrectedItem;
import uk.gov.mrtm.api.reporting.domain.common.VerifierComment;
import uk.gov.netz.api.common.validation.SpELExpression;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@SpELExpression(expression = "{(#verifierUncorrectedItem != null) == (#verifierComment == null)}", message = "virApplicationRespondedToRegulatorCommentsRequestActionPayload.invalid")
public class VirApplicationRespondedToRegulatorCommentsRequestActionPayload extends RequestActionPayload {

    @NotNull
    @PastOrPresent
    private Year reportingYear;
    
    @Valid
    private UncorrectedItem verifierUncorrectedItem;

    @Valid
    private VerifierComment verifierComment;

    @Valid
    @NotNull
    private OperatorImprovementResponse operatorImprovementResponse;

    @Valid
    @NotNull
    private RegulatorImprovementResponse regulatorImprovementResponse;

    @Valid
    @NotNull
    private OperatorImprovementFollowUpResponse operatorImprovementFollowUpResponse;

    @Builder.Default
    private Map<UUID, String> virAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return getVirAttachments();
    }
}
