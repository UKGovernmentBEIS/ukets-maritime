package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpAcceptedVariationDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationRegulatorLedApprovedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationChangeType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReasonType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestActionUserInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

public class EmpVariationSubmitRegulatorLedMapperTest {

    private final EmpVariationSubmitRegulatorLedMapper mapper = Mappers.getMapper(EmpVariationSubmitRegulatorLedMapper.class);
    @Test
    public void testToEmpVariationApplicationSubmitRegulatorLedRequestTaskPayload() {

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
                        .operatorName(operatorName)
                        .contactAddress(contactAddress)
                        .build())
                .build();

        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.EMP_VARIATION_REQUEST_PAYLOAD)
                .emissionsMonitoringPlan(emp)
                .reviewGroupDecisionsRegulatorLed(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder()
                        .notes("notes")
                        .variationScheduleItems(List.of("item1", "item2"))
                        .build()))
                .build();

        EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload result =
                mapper.toEmpVariationApplicationSubmitRegulatorLedRequestTaskPayload(requestPayload,
                        MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_SUBMIT_REGULATOR_LED_PAYLOAD);

        assertThat(result.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_SUBMIT_REGULATOR_LED_PAYLOAD);
        assertThat(result.getReasonRegulatorLed()).isEqualTo(requestPayload.getReasonRegulatorLed());
        assertThat(result.getReviewGroupDecisions()).isEqualTo(requestPayload.getReviewGroupDecisionsRegulatorLed());
        assertThat(result.getEmissionsMonitoringPlan()).isEqualTo(EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(true).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName(operatorName)
                        .contactAddress(contactAddress)
                        .build())
                .build());
    }

    @Test
    void toEmpVariationApplicationRegulatorLedApprovedRequestActionPayload() {
        UUID att1 = UUID.randomUUID();
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder().exist(true).build())
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("opName1")
                        .build())
                .build();
        EmpVariationRequestPayload requestPayload = EmpVariationRequestPayload.builder()
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(EmpVariationDetails.builder()
                        .changes(List.of(EmpVariationChangeType.CHANGE_EMISSION_FACTOR_VALUES))
                        .reason("reason1")
                        .build())
                .reasonRegulatorLed(EmpVariationRegulatorLedReason.builder()
                        .type(EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY)
                        .build())
                .decisionNotification(DecisionNotification.builder()
                        .operators(Set.of("op1"))
                        .build())
                .reviewGroupDecisionsRegulatorLed(Map.of(
                        EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder().build()
                ))
                .originalEmpContainer(EmissionsMonitoringPlanContainer.builder()
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                                .build())
                        .build())
                .empSectionsCompleted(Map.of("section1", "true"))
                .empAttachments(Map.of(att1, "att1.pdf"))
                .build();

        MrtmAccount accountInfo = MrtmAccount.builder().id(1L).imoNumber("1234567").build();

        Map<String, RequestActionUserInfo> usersInfo = new HashMap<>(Map.of(
                "userId1", RequestActionUserInfo.builder().name("user1").build()
        ));

        EmpVariationApplicationRegulatorLedApprovedRequestActionPayload result = mapper.toEmpVariationApplicationRegulatorLedApprovedRequestActionPayload(requestPayload, accountInfo, usersInfo, MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED_PAYLOAD);

        assertThat(result).isEqualTo(EmpVariationApplicationRegulatorLedApprovedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.EMP_VARIATION_APPLICATION_REGULATOR_LED_APPROVED_PAYLOAD)
                .decisionNotification(DecisionNotification.builder()
                        .operators(Set.of("op1"))
                        .build())
                .usersInfo(usersInfo)
                .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                        .abbreviations(EmpAbbreviations.builder().exist(true).build())
                        .operatorDetails(EmpOperatorDetails.builder()
                                .operatorName("opName1")
                                .build())
                        .build())
                .empVariationDetails(EmpVariationDetails.builder()
                        .changes(List.of(EmpVariationChangeType.CHANGE_EMISSION_FACTOR_VALUES))
                        .reason("reason1")
                        .build())
                .reasonRegulatorLed(EmpVariationRegulatorLedReason.builder()
                        .type(EmpVariationRegulatorLedReasonType.FAILED_TO_COMPLY_OR_APPLY)
                        .build())
                .reviewGroupDecisions(Map.of(
                        EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS, EmpAcceptedVariationDecisionDetails.builder().build()
                ))
                .originalEmpContainer(EmissionsMonitoringPlanContainer.builder()
                        .emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
                                .abbreviations(EmpAbbreviations.builder().exist(false).build())
                                .build())
                        .build())
                .empSectionsCompleted(Map.of("section1", "true"))
                .empAttachments(Map.of(att1, "att1.pdf"))
                .build());
    }
}
