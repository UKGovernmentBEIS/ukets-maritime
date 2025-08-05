package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;


import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationSubmitRegulatorLedMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmpVariationAddRegulatorLedApprovedRequestActionService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private final MrtmAccountQueryService mrtmAccountQueryService;
    private static final EmpVariationSubmitRegulatorLedMapper MAPPER = Mappers
            .getMapper(EmpVariationSubmitRegulatorLedMapper.class);

    @Transactional
    public void add(final String requestId) {
        final Request request = requestService.findRequestById(requestId);
        final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();

        final MrtmAccount accountInfo = mrtmAccountQueryService.getAccountById(request.getAccountId());

        final DecisionNotification notification = requestPayload.getDecisionNotification();
        final Map<String, RequestActionUserInfo> usersInfo = requestActionUserInfoResolver
                .getUsersInfo(notification.getOperators(), notification.getSignatory(), request);

        final EmpVariationApplicationRegulatorLedApprovedRequestActionPayload actionPayload = MAPPER
                .toEmpVariationApplicationRegulatorLedApprovedRequestActionPayload(requestPayload, accountInfo, usersInfo, MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED_PAYLOAD);

        requestService.addActionToRequest(request,
                actionPayload,
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED,
                requestPayload.getRegulatorReviewer());
    }
}
