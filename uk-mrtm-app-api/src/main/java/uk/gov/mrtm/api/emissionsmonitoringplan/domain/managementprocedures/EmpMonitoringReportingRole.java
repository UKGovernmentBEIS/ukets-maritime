package uk.gov.mrtm.api.emissionsmonitoringplan.domain.managementprocedures;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmpMonitoringReportingRole {

    @NotBlank
    @Size(max = 50)
    private String jobTitle;

    @NotBlank
    @Size(max = 500)
    private String mainDuties;
}

