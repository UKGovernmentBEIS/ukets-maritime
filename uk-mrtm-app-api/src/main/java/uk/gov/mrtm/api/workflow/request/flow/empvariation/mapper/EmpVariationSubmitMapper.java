package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmittedRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpVariationSubmitMapper {
    @Mapping(target = "payloadType", expression = "java(uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_SUBMITTED_PAYLOAD)")
    @Mapping(target = "attachments", ignore = true)
    @Mapping(target = "fileDocuments", ignore = true)
    @Mapping(target = "empAttachments", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.attachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.operatorDetails.aerRelatedAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.empSectionAttachmentIds", ignore = true)
    @Mapping(target = "emissionsMonitoringPlan.managementProcedures.attachmentIds", ignore = true)
    EmpVariationApplicationSubmittedRequestActionPayload toEmpVariationApplicationSubmittedRequestActionPayload(EmpVariationApplicationSubmitRequestTaskPayload taskPayload,
                                                                                                                String operatorName,
                                                                                                                AddressStateDTO contactAddress);

    @AfterMapping
    default void setEmpAttachments(@MappingTarget EmpVariationApplicationSubmittedRequestActionPayload requestActionPayload,
                                   EmpVariationApplicationSubmitRequestTaskPayload taskPayload) {
        requestActionPayload.setEmpAttachments(taskPayload.getEmpAttachments());
    }

    @AfterMapping
    default void setOperatorDetails(@MappingTarget EmpVariationApplicationSubmittedRequestActionPayload requestActionPayload,
                                    String operatorName, AddressStateDTO contactAddress) {
        EmpOperatorDetails operatorDetails = requestActionPayload.getEmissionsMonitoringPlan().getOperatorDetails();
        operatorDetails.setOperatorName(operatorName);
        operatorDetails.setContactAddress(contactAddress);
    }
}
