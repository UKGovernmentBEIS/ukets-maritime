package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.time.LocalDateTime;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpReissueRequestMapper {


    @Mapping(target = "endDate", source = "endDate")
    EmpVariationRequestInfo toEmpVariationRequestInfo(Request request, LocalDateTime endDate);

    EmpVariationRequestInfo toEmpVariationRequestInfo(Request request);

    @AfterMapping
    default void setMetadata(@MappingTarget EmpVariationRequestInfo empVariationRequestInfo, Request request) {
        EmpReissueRequestMetadata requestMetadata = (EmpReissueRequestMetadata) request.getMetadata();
        EmpVariationRequestMetadata variationRequestMetadata = EmpVariationRequestMetadata.builder()
                .summary(requestMetadata.getSummary())
                .empConsolidationNumber(requestMetadata.getEmpConsolidationNumber())
                .build();
        empVariationRequestInfo.setMetadata(variationRequestMetadata);
    }
}
