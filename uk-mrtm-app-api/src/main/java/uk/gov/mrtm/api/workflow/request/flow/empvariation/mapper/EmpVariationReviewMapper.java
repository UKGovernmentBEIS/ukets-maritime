package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationAmendsSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationDeemedWithdrawnRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRejectedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.Map;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpVariationReviewMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    EmpVariationApplicationReviewRequestTaskPayload toEmpVariationApplicationReviewRequestTaskPayload(
            EmpVariationRequestPayload empVariationRequestPayload, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.aerRelatedAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.empSectionAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.managementProcedures.attachmentIds", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "fileDocuments", ignore = true)
    EmpVariationApplicationApprovedRequestActionPayload toEmpVariationApplicationApprovedRequestActionPayload(
            EmpVariationRequestPayload taskPayload, Map<String, RequestActionUserInfo> usersInfo,
            String operatorName, AddressStateDTO contactAddress, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "fileDocuments", ignore = true)
    EmpVariationApplicationRejectedRequestActionPayload toEmpVariationApplicationRejectedRequestActionPayload(
            EmpVariationRequestPayload requestPayload, Map<String, RequestActionUserInfo> usersInfo, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "fileDocuments", ignore = true)
    EmpVariationApplicationDeemedWithdrawnRequestActionPayload toEmpVariationApplicationDeemedWithdrawnRequestActionPayload(
            EmpVariationRequestPayload requestPayload, Map<String, RequestActionUserInfo> usersInfo, String payloadType);

    EmissionsMonitoringPlanContainer toEmissionsMonitoringPlanContainer(
            EmpVariationApplicationReviewRequestTaskPayload applicationReviewRequestTaskPayload);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "empAttachments", ignore = true)
    EmpVariationApplicationAmendsSubmittedRequestActionPayload toEmpVariationApplicationAmendsSubmittedRequestActionPayload(
            EmpVariationRequestPayload requestPayload, String payloadType);

    @AfterMapping
    default void setEmpAttachments(@MappingTarget EmpVariationApplicationAmendsSubmittedRequestActionPayload requestActionPayload,
                                   EmpVariationRequestPayload requestPayload) {
        requestActionPayload.setEmpAttachments(requestPayload.getEmpAttachments());
    }
}
