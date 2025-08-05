package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;

import java.util.Set;

@Service
public class EmpIssuanceWaitForAmendsInitializer extends EmpIssuanceReviewInitializer {

    @Override
    protected String getRequestTaskPayloadType() {
        return MrtmRequestTaskPayloadType.EMP_ISSUANCE_WAIT_FOR_AMENDS_PAYLOAD;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS);
    }
}
