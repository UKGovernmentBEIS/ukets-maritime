package uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import static org.assertj.core.api.Assertions.assertThat;

public class EmpReissueRequestMapperTest {

    private final EmpReissueRequestMapper cut = Mappers.getMapper(EmpReissueRequestMapper.class);

    @Test
    void toEmpVariationRequestInfo(){
        String requestId = "requestId";
        EmpReissueRequestMetadata requestMetadata = EmpReissueRequestMetadata.builder()
                .empConsolidationNumber(1)
                .build();

        Request request = Request.builder()
                .id(requestId).type(
                        RequestType.builder()
                                .code(MrtmRequestType.EMP_VARIATION)
                                .build())
                .metadata(requestMetadata)
                .build();

        EmpVariationRequestInfo expected = EmpVariationRequestInfo.builder()
                .id(requestId)
                .metadata(EmpVariationRequestMetadata.builder()
                        .empConsolidationNumber(1)
                        .build())
                .build();

        EmpVariationRequestInfo actual = cut.toEmpVariationRequestInfo(request);

        assertThat(expected).isEqualTo(actual);
    }
}
