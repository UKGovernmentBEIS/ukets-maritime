package uk.gov.mrtm.api.workflow.request.flow.doe.common.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doe {

    @Valid
    @NotNull
    private DoeMaritimeEmissions maritimeEmissions;

}
