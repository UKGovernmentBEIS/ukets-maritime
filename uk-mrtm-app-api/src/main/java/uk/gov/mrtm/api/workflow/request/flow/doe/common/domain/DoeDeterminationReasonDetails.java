package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;


import jakarta.validation.constraints.NotBlank;
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
public class DoeDeterminationReasonDetails {

    @NotNull
    private DoeDeterminationReasonType type;

    @Size(max=10000)
    @NotBlank
    private String noticeText;
}
