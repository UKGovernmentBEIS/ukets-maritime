package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationReviewMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpVariationDeemedWithdrawnAddRequestActionService {

    private final RequestService requestService;
    private static final EmpVariationReviewMapper EMP_VARIATION_MAPPER = Mappers.getMapper(EmpVariationReviewMapper.class);
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;

    public void addRequestAction(final String requestId) {
        Request request = requestService.findRequestById(requestId);
        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        // get users' information
        DecisionNotification notification = requestPayload.getDecisionNotification();
        Map<String, RequestActionUserInfo> usersInfo =
                requestActionUserInfoResolver.getUsersInfo(notification.getOperators(), notification.getSignatory(), request);

        EmpVariationApplicationDeemedWithdrawnRequestActionPayload requestActionPayload =
                EMP_VARIATION_MAPPER.toEmpVariationApplicationDeemedWithdrawnRequestActionPayload(requestPayload,
                        usersInfo, MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_DEEMED_WITHDRAWN_PAYLOAD);

        requestService.addActionToRequest(request,
                requestActionPayload,
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_DEEMED_WITHDRAWN,
                requestPayload.getRegulatorReviewer());
    }
}
