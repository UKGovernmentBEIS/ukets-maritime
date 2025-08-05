package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.transform;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpSubmitMapper {

    EmissionsMonitoringPlanContainer toEmissionsMonitoringPlanContainer(
            EmpIssuanceApplicationSubmitRequestTaskPayload empIssuanceApplicationSubmitRequestTaskPayload);

    @Mapping(target = "payloadType", expression = "java(uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_SUBMITTED_PAYLOAD)")
    @Mapping(target = "empAttachments", ignore = true)
    @Mapping(target = "attachments", ignore = true)
    EmpIssuanceApplicationSubmittedRequestActionPayload toEmpIssuanceApplicationSubmittedRequestActionPayload(EmpIssuanceApplicationSubmitRequestTaskPayload empIssuanceApplicationSubmitRequestTaskPayload);

    @Mapping(target = "payloadType", source = "payloadType")
    EmpIssuanceApplicationSubmitRequestTaskPayload toEmpIssuanceApplicationSubmitRequestTaskPayload(
        EmpIssuanceRequestPayload requestPayload, String payloadType);

    @AfterMapping
    default void setEmpAttachments(@MappingTarget EmpIssuanceApplicationSubmittedRequestActionPayload requestActionPayload,
                                   EmpIssuanceApplicationSubmitRequestTaskPayload taskPayload) {
        requestActionPayload.setEmpAttachments(taskPayload.getEmpAttachments());
    }
}
