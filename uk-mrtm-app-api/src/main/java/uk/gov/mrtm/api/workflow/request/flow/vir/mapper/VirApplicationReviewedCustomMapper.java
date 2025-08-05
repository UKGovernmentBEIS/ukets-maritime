package uk.gov.mrtm.api.workflow.request.flow.vir.mapper;

import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewedRequestActionPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.RequestAction;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestActionDTO;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionCustomMapper;
import uk.gov.netz.api.workflow.request.core.transform.RequestActionMapper;

import java.util.Set;

@Service
public class VirApplicationReviewedCustomMapper implements RequestActionCustomMapper {

    private static final RequestActionMapper requestActionMapper = Mappers.getMapper(RequestActionMapper.class);
    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Override
    public RequestActionDTO toRequestActionDTO(final RequestAction requestAction) {
        
        final VirApplicationReviewedRequestActionPayload entityPayload =
                (VirApplicationReviewedRequestActionPayload) requestAction.getPayload();

        final RequestActionDTO requestActionDTO = requestActionMapper.toRequestActionDTOIgnorePayload(requestAction);
        final VirApplicationReviewedRequestActionPayload dtoPayload = VIR_MAPPER.cloneReviewedPayloadIgnoreComments(entityPayload);

        requestActionDTO.setPayload(dtoPayload);

        return requestActionDTO;
    }

    @Override
    public String getRequestActionType() {
        return MrtmRequestActionType.VIR_APPLICATION_REVIEWED;
    }

    @Override
    public Set<String> getUserRoleTypes() {
        return Set.of(RoleTypeConstants.OPERATOR, RoleTypeConstants.VERIFIER);
    }
}
