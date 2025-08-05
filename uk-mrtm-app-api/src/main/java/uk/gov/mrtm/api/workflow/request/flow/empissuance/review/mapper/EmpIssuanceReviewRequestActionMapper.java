package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpIssuanceReviewRequestActionMapper {

    @Mapping(target = "determination.reason", ignore = true)
    @Mapping(target = "reviewGroupDecisions", ignore = true)
    EmpIssuanceApplicationApprovedRequestActionPayload cloneApprovedPayloadIgnoreReasonAndDecisions(
        EmpIssuanceApplicationApprovedRequestActionPayload payload);

    @Mapping(target = "determination.reason", ignore = true)
    EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload cloneDeemedWithdrawnPayloadIgnoreReason(
        EmpIssuanceApplicationDeemedWithdrawnRequestActionPayload payload);
}
