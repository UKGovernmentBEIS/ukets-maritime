package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper.DoeMapper;
import uk.gov.netz.api.userinfoapi.UserInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestAccountContactQueryService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoeAddSubmittedRequestActionService {

    private final RequestService requestService;
    private final RequestActionUserInfoResolver requestActionUserInfoResolver;
    private final RequestAccountContactQueryService requestAccountContactQueryService;

    private static final DoeMapper DOE_MAPPER = Mappers.getMapper(DoeMapper.class);

    @Transactional
    public void add(final String requestId) {
        Request request = requestService.findRequestById(requestId);
        DoeRequestPayload requestPayload = (DoeRequestPayload) request.getPayload();
        Optional<UserInfoDTO> requestAccountPrimaryContact = requestAccountContactQueryService.getRequestAccountPrimaryContact(request);

        DecisionNotification notification = requestPayload.getDecisionNotification();

        // if there isn't primary contact defined in the account then there can't be any other operator users, thus usersInfo may contain only signatory info.
        Map<String, RequestActionUserInfo> usersInfo = requestAccountPrimaryContact.isPresent() ?
            requestActionUserInfoResolver.getUsersInfo(notification.getOperators(), notification.getSignatory(), request) :
            Map.of(notification.getSignatory(), requestActionUserInfoResolver.getSignatoryUserInfo(notification.getSignatory()));

        DoeApplicationSubmittedRequestActionPayload actionPayload =
                DOE_MAPPER.toSubmittedActionPayload(requestPayload, usersInfo, MrtmRequestActionPayloadType.DOE_APPLICATION_SUBMITTED_PAYLOAD);

        requestService.addActionToRequest(request,
            actionPayload,
            MrtmRequestActionType.DOE_APPLICATION_SUBMITTED,
            requestPayload.getRegulatorAssignee());
    }
}
