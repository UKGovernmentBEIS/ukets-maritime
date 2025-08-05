package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.application.taskview.RequestInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NonComplianceApplicationSubmitInitializer implements InitializeRequestTaskHandler {

    private final RequestQueryService requestQueryService;
    
    @Override
    public RequestTaskPayload initializePayload(Request request) {

        final Long accountId = request.getAccountId();

        final List<String> excludedTypes = List.of(MrtmRequestType.NON_COMPLIANCE);
        final List<RequestInfoDTO> requestInfoDTOS = requestQueryService
            .findByResourceTypeAndResourceIdAndTypeNotIn(excludedTypes, ResourceType.ACCOUNT, accountId.toString());

        return NonComplianceApplicationSubmitRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_APPLICATION_SUBMIT_PAYLOAD)
            .availableRequests(requestInfoDTOS)
            .build();
    }

    @Override
    public Set<String> getRequestTaskTypes() {
        return Set.of(MrtmRequestTaskType.NON_COMPLIANCE_APPLICATION_SUBMIT);
    }
}
