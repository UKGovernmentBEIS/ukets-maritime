package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpVariationSaveReviewGroupDecisionRegulatorLedRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotNull
    private EmpReviewGroup group;

    @NotNull
    @Valid
    private EmpAcceptedVariationDecisionDetails decision;

    @Builder.Default
    private Map<String, String> empSectionsCompleted = new HashMap<>();
}
