package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpBatchReissueRequestMetadata extends RequestMetadata {

    @NotBlank
    private String submitterId; //user id

    @NotBlank
    private String submitter; //full name

    private LocalDate submissionDate;

    @NotBlank
    @Size(max = 10000)
    private String summary;

    @Builder.Default
    private Map<Long, EmpEmpReissueAccountReport> accountsReports = new HashMap<>();

}
