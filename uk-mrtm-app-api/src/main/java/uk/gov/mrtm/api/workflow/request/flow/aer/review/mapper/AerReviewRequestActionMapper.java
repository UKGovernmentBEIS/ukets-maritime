package uk.gov.mrtm.api.workflow.request.flow.aer.review.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationCompletedRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerReviewRequestActionMapper {

    @Mapping(target = "reviewGroupDecisions", ignore = true)
    AerApplicationCompletedRequestActionPayload cloneCompletedPayloadIgnoreDecisions(
            AerApplicationCompletedRequestActionPayload payload);
}
