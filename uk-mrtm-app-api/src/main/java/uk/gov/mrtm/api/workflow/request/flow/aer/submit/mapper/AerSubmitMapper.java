package uk.gov.mrtm.api.workflow.request.flow.aer.submit.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.reporting.domain.AerContainer;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerSubmitMapper {

    AerContainer toAerContainer(AerApplicationSubmitRequestTaskPayload taskPayload);

    AerContainer toAerContainer(AerApplicationSubmitRequestTaskPayload taskPayload, AerVerificationReport verificationReport);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    AerApplicationSubmittedRequestActionPayload toAerApplicationSubmittedRequestActionPayload(
        AerApplicationSubmitRequestTaskPayload taskPayload,
        String payloadType);
}
