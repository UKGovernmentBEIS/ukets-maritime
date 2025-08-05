package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class EmpVariationSubmitMapperTest {

    private final EmpVariationSubmitMapper mapper = Mappers.getMapper(EmpVariationSubmitMapper.class);

    @Test
    void toEmpVariationApplicationSubmittedRequestActionPayload() {
        UUID att1 = UUID.randomUUID();
        String operatorName = "operatorName";
        AddressStateDTO contactAddress = AddressStateDTO.builder()
                .line1("line1")
                .state("state")
                .city("city")
                .country("country")
                .build();
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(true).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("opName1")
                        .build())
                .build();
        EmpVariationApplicationSubmitRequestTaskPayload requestPayload = EmpVariationApplicationSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(EmpVariationDetails.builder()
                        .changes(List.of(EmpVariationChangeType.ADD_NEW_SHIP))
                        .reason("reason1")
                        .build())
                .empSectionsCompleted(Map.of("section1", "completed"))
                .empAttachments(Map.of(att1, "att1.pdf"))
                .build();

        EmpVariationApplicationSubmittedRequestActionPayload result = mapper.toEmpVariationApplicationSubmittedRequestActionPayload(requestPayload,
                operatorName, contactAddress);

        assertThat(result).isEqualTo(EmpVariationApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_SUBMITTED_PAYLOAD)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .abbreviations(EmpAbbreviations.builder().exist(true).build())
                        .operatorDetails(EmpOperatorDetails.builder()
                                .operatorName(operatorName)
                                .contactAddress(contactAddress)
                                .build())
                        .build())
                .empVariationDetails(EmpVariationDetails.builder()
                        .changes(List.of(EmpVariationChangeType.ADD_NEW_SHIP))
                        .reason("reason1")
                        .build())
                .empSectionsCompleted(Map.of("section1", "completed"))
                .empAttachments(Map.of(att1, "att1.pdf"))
                .build());
    }
}
