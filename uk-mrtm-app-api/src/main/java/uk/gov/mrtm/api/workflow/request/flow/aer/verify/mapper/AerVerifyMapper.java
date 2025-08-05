package uk.gov.mrtm.api.workflow.request.flow.aer.verify.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain.AerApplicationVerificationSubmittedRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;

import java.time.Year;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerVerifyMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "verificationReport", source = "verificationReport")
    @Mapping(target = "notCoveredChangesProvided", source = "requestPayload.aer.aerMonitoringPlanChanges.changes")
    @Mapping(target = "attachments", ignore = true)
    AerApplicationVerificationSubmitRequestTaskPayload toAerApplicationVerificationSubmitRequestTaskPayload(
            AerRequestPayload requestPayload,
            AerVerificationReport verificationReport,
            Year reportingYear,
            String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "aer.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "aer.aerSectionAttachmentIds", ignore = true)
    AerApplicationVerificationSubmittedRequestActionPayload toAerApplicationVerificationSubmittedRequestActionPayload(
            AerApplicationVerificationSubmitRequestTaskPayload requestTaskPayload,
            String payloadType
    );
}
