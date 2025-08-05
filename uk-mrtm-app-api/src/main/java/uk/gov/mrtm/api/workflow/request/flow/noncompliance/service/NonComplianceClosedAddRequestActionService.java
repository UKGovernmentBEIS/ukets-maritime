package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationClosedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.mapper.NonComplianceMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class NonComplianceClosedAddRequestActionService {

    private static final NonComplianceMapper NON_COMPLIANCE_MAPPER = Mappers.getMapper(NonComplianceMapper.class);
    private final RequestService requestService;


    public void addRequestAction(final String requestId) {

        final Request request = requestService.findRequestById(requestId);
        final NonComplianceRequestPayload requestPayload = (NonComplianceRequestPayload) request.getPayload();

        final NonComplianceApplicationClosedRequestActionPayload actionPayload = NON_COMPLIANCE_MAPPER
            .toClosedRequestAction(requestPayload, MrtmRequestActionPayloadType.NON_COMPLIANCE_APPLICATION_CLOSED_PAYLOAD);

        final String assignee = requestPayload.getRegulatorAssignee();

        requestService.addActionToRequest(
            request,
            actionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_APPLICATION_CLOSED,
            assignee
        );
    }
}
