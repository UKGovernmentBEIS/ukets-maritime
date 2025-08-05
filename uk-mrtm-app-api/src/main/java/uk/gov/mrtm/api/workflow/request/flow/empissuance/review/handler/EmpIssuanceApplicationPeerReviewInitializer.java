package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;

import java.util.Set;

@Service
public class EmpIssuanceApplicationPeerReviewInitializer extends EmpIssuanceReviewInitializer {

    @Override
    protected String getRequestTaskPayloadType() {
        return MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW_PAYLOAD;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW);
    }
}
