package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpReissueRequestMetadata extends RequestMetadata {

    @NotBlank
    private String batchRequestId;

    @NotBlank
    private String submitterId; //user id

    @NotBlank
    private String submitter; //full name

    @NotBlank
    private String signatory;

    @NotBlank
    @Size(max = 10000)
    private String summary;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Integer empConsolidationNumber;
}
