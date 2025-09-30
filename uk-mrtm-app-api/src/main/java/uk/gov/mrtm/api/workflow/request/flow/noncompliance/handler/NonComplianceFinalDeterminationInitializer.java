package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class NonComplianceFinalDeterminationInitializer implements InitializeRequestTaskHandler {

    @Override
    public RequestTaskPayload initializePayload(Request request) {

        NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();

        return NonComplianceFinalDeterminationRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_FINAL_DETERMINATION_PAYLOAD)
            .nonComplianceComments(requestPayload.getNonComplianceComments())
            .nonComplianceDate(requestPayload.getNonComplianceDate())
            .complianceDate(requestPayload.getComplianceDate())
            .reason(requestPayload.getReason())
            .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.NON_COMPLIANCE_FINAL_DETERMINATION);
    }
}
