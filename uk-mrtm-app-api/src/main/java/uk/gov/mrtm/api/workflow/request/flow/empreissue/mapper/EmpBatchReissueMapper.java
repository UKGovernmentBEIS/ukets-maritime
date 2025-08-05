package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpBatchReissueCompletedRequestActionPayload;
import uk.gov.netz.api.common.config.MapperConfig;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpBatchReissueMapper {

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "summary", source = "requestPayload.summary")
    EmpBatchReissueSubmittedRequestActionPayload toSubmittedActionPayload(
        EmpBatchReissueRequestPayload requestPayload, EmpBatchReissueRequestMetadata metadata, String signatoryName, String payloadType);

    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "numberOfAccounts", expression = "java(metadata.getAccountsReports().size())")
    @Mapping(target = "summary", source = "requestPayload.summary")
    EmpEmpBatchReissueCompletedRequestActionPayload toCompletedActionPayload(
        EmpBatchReissueRequestPayload requestPayload, EmpBatchReissueRequestMetadata metadata, String signatoryName, String payloadType);

}
