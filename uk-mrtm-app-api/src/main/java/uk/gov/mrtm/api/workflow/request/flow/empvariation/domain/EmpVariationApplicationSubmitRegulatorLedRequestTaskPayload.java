package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;

import java.util.EnumMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload extends EmpVariationApplicationSubmitRequestTaskPayload {

    private EmissionsMonitoringPlanContainer originalEmpContainer;

    @Valid
    @NotNull
    private EmpVariationRegulatorLedReason reasonRegulatorLed;

    @Builder.Default
    private Map<EmpReviewGroup, EmpAcceptedVariationDecisionDetails> reviewGroupDecisions = new EnumMap<>(EmpReviewGroup.class);
}
