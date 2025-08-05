package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpVariationAddCancelledRequestActionService {

	private final RequestService requestService;

    public void add(final String requestId, final String userRole) {

        final Request request = requestService.findRequestById(requestId);
        final String assignee = RoleTypeConstants.OPERATOR.equals(userRole) ?
            request.getPayload().getOperatorAssignee() : request.getPayload().getRegulatorAssignee();

        requestService.addActionToRequest(request,
            null,
            MrtmRequestActionType.EMP_VARIATION_APPLICATION_CANCELLED,
            assignee);
    }
}
