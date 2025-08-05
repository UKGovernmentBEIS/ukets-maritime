package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestCreateActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpBatchReissueRequestCreateActionPayload extends RequestCreateActionPayload {

    @NotNull
    @Size(max = 10000)
    private String summary;

    @NotBlank
    private String signatory;
}
