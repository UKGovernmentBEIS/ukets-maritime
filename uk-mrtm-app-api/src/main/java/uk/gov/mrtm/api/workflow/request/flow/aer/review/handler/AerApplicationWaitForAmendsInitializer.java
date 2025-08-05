package uk.gov.mrtm.api.workflow.request.flow.aer.review.handler;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper.AerReviewMapper;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestVerificationService;

import java.util.Set;

@Service
public class AerApplicationWaitForAmendsInitializer extends AerReviewInitializer {

    public AerApplicationWaitForAmendsInitializer(RequestVerificationService requestVerificationService,
                                                  AerReviewMapper aerReviewMapper) {
        super(requestVerificationService, aerReviewMapper);
    }

    @Override
    protected String getRequestTaskPayloadType() {
        return MrtmRequestTaskPayloadType.AER_WAIT_FOR_AMENDS_PAYLOAD;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.AER_WAIT_FOR_AMENDS);
    }
}
