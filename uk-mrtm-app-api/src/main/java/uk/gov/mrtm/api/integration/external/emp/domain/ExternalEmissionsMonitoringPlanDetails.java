package uk.gov.mrtm.api.integration.external.emp.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExternalEmissionsMonitoringPlanDetails {

    @Schema(description = "Submission date of the emissions monitoring plain")
    private LocalDateTime submissionDate;

    @Schema(description = "Emissions monitoring plain version")
    private int version;

    @Schema(description = "Regulator comments")
    private String comments;

    @Schema(description = "Emissions monitoring plain data")
    private ExternalEmissionsMonitoringPlan empData;

}
