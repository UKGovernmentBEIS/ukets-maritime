package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class NonComplianceCivilPenaltyInitializer implements InitializeRequestTaskHandler {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();
        // when returning from a peer review the data should be retained, whereas 
        // when returning from a reissue civil penalty notice determination the data should be cleared
        final boolean reIssueCivilPenalty = requestPayload.isReIssueCivilPenalty();
        final RequestTaskPayload taskPayload = reIssueCivilPenalty ?
            NonComplianceCivilPenaltyRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_PAYLOAD)
                .reason(requestPayload.getReason())
                .nonComplianceComments(requestPayload.getNonComplianceComments())
                .complianceDate(requestPayload.getComplianceDate())
                .nonComplianceDate(requestPayload.getNonComplianceDate())
                .build() :
            NON_COMPLIANCE_MAPPER.toNonComplianceCivilPenaltyRequestTaskPayload(
                requestPayload,
                MrtmRequestTaskPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_PAYLOAD
            );
        
        requestPayload.setReIssueCivilPenalty(false);
        return taskPayload;
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY);
    }
}
