package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;


import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoeDeterminationReason {

    @NotNull
    @Valid
    private DoeDeterminationReasonDetails details;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Size(max=10000)
    private String furtherDetails;
}
