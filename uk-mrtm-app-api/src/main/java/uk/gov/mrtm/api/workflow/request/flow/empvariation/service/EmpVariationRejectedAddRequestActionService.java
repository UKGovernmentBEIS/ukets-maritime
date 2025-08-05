package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRejectedRequestActionPayload;
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
public class EmpVariationRejectedAddRequestActionService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private static final EmpVariationReviewMapper EMP_VARIATION_MAPPER = Mappers.getMapper(EmpVariationReviewMapper.class);
    private final MrtmAccountQueryService accountQueryService;

    public void addRequestAction(final String requestId) {
        Request request = requestService.findRequestById(requestId);
        EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        DecisionNotification notification = requestPayload.getDecisionNotification();
        Map<String, RequestActionUserInfo> usersInfo =
                requestActionUserInfoResolver.getUsersInfo(notification.getOperators(), notification.getSignatory(), request);

        EmpVariationApplicationRejectedRequestActionPayload requestActionPayload =
                EMP_VARIATION_MAPPER.toEmpVariationApplicationRejectedRequestActionPayload(requestPayload,
                        usersInfo, MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_REJECTED_PAYLOAD);

        requestService.addActionToRequest(request,
                requestActionPayload,
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_REJECTED,
                requestPayload.getRegulatorReviewer());
    }
}
