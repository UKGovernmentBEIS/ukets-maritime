package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.common.config.MapperConfig;

import java.util.Map;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpReissueMapper {

    EmpEmpReissueAccountReport toEmpReissueAccountReport(EmpReissueAccountDetails accountDetails);

    Map<Long, EmpEmpReissueAccountReport> toEmpReissueAccountsReports(Map<Long, EmpReissueAccountDetails> accountsDetails);


    @Mapping(target = "payloadType", source = "payloadType")
    @Mapping(target = "summary", source = "requestPayload.summary")
    EmpReissueCompletedRequestActionPayload toCompletedActionPayload(EmpReissueRequestPayload requestPayload,
                                                                     EmpReissueRequestMetadata requestMetadata, String signatoryName, String payloadType);

}
