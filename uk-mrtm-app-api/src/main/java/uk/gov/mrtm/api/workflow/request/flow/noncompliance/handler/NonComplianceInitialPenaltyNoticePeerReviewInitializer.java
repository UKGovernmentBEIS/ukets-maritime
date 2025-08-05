package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;


import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class NonComplianceInitialPenaltyNoticePeerReviewInitializer implements InitializeRequestTaskHandler {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);

    @Override
    public RequestTaskPayload initializePayload(final Request request) {

        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();

        return NON_COMPLIANCE_MAPPER.toNonComplianceInitialPenaltyNoticeRequestTaskPayload(
            requestPayload,
            MrtmRequestTaskPayloadType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW_PAYLOAD
        );
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW);
    }
}
