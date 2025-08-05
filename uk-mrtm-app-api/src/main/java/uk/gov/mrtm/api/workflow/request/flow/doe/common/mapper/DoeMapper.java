package uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.Map;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface DoeMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    DoeApplicationSubmitRequestTaskPayload toDoeApplicationSubmitRequestTaskPayload(
            DoeRequestPayload requestPayload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    DoeApplicationSubmittedRequestActionPayload toSubmittedActionPayload(
            DoeRequestPayload requestPayload,  Map<String, RequestActionUserInfo> usersInfo, String payloadType);

    @Mapping(target = "doe.maritimeEmissions.determinationReason.furtherDetails", ignore = true)
    @Mapping(target = "doe.maritimeEmissions.feeDetails.comments", ignore = true)
    DoeApplicationSubmittedRequestActionPayload cloneSubmittedRequestActionPayloadIgnoreFurtherDetailsFeeComments(
            DoeApplicationSubmittedRequestActionPayload payload);
}
