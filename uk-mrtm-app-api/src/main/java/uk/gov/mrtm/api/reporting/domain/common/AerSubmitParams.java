package uk.gov.mrtm.api.reporting.domain.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.reporting.domain.AerContainer;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AerSubmitParams {

    private Long accountId;
    private AerContainer aerContainer;
}
