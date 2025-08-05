package uk.gov.mrtm.api.web.orchestrator.workflow.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.Builder;
import lombok.Data;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestDetailsSearchResults;

@Data
@Builder
public class EmpBatchReissuesResponseDTO {

    @JsonUnwrapped
    private RequestDetailsSearchResults requestDetailsSearchResults;

    private boolean canInitiateBatchReissue;
}
