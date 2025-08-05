package uk.gov.mrtm.api.workflow.request.flow.empnotification.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReturnedForAmendsRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionCustomMapper;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionMapper;

import java.util.Set;
@Service
public class EmpNotificationFollowUpReturnedForAmendsCustomMapper implements RequestActionCustomMapper {
    private final RequestActionMapper requestActionMapper = Mappers.getMapper(RequestActionMapper.class);

    private final EmpNotificationMapper requestActionPayloadMapper =
            Mappers.getMapper(EmpNotificationMapper.class);

    @Override
    public RequestActionDTO toRequestActionDTO(RequestAction requestAction) {

        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload actionPayload =
                (EmpNotificationFollowUpReturnedForAmendsRequestActionPayload) requestAction.getPayload();

        final RequestActionDTO requestActionDTO = requestActionMapper.toRequestActionDTOIgnorePayload(requestAction);

        final EmpNotificationFollowUpReturnedForAmendsRequestActionPayload dtoPayload =
                requestActionPayloadMapper.cloneReturnedForAmendsIgnoreNotes(actionPayload,
                        MrtmRequestActionPayloadType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS_PAYLOAD);

        requestActionDTO.setPayload(dtoPayload);

        return requestActionDTO;
    }

    @Override
    public String getRequestActionType() {
        return MrtmRequestActionType.EMP_NOTIFICATION_FOLLOW_UP_RETURNED_FOR_AMENDS;
    }

    @Override
    public Set<String> getUserRoleTypes() {
        return Set.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
