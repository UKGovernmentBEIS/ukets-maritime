package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AerMonitoringPlanVersion {

    @NotNull
    private String empId;

    @NotNull
    private LocalDate empApprovalDate;

    @NotNull
    private Integer empConsolidationNumber;
}
