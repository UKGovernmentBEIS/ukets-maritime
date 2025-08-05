package uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.domain.dto.AddressStateDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.IndividualOrganisation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.OrganisationLegalStatusType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.EmissionsMonitoringPlanFactory;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpVariationMapperTest {

    private final EmpVariationMapper empVariationMapper = Mappers.getMapper(EmpVariationMapper.class);

    private static final UUID DOCUMENT_ID_1 = UUID.randomUUID();
    private static final UUID DOCUMENT_ID_2 = UUID.randomUUID();
    private static final String IMO_NUMBER = "7654321";
    private static final String NAME = "new name";

    @Test
    void toEmpIssuanceApplicationReviewRequestTaskPayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan =
                EmissionsMonitoringPlanFactory.getEmissionsMonitoringPlan(DOCUMENT_ID_1, IMO_NUMBER);
        AddressStateDTO addressStateDTO = AddressStateDTO.builder()
                .line1("new line1")
                .city("new city")
                .country("new country")
                .postcode("new postcode")
                .build();

        EmpIssuanceApplicationReviewRequestTaskPayload expectedRequestTaskPayload =
                EmpIssuanceApplicationReviewRequestTaskPayload
                        .builder()
                        .emissionsMonitoringPlan(emissionsMonitoringPlan)
                        .empSectionsCompleted(Map.of("a", "b"))
                        .empAttachments(Map.of(DOCUMENT_ID_1, "test"))
                        .determination(EmpIssuanceDetermination.builder().build())
                        .reviewGroupDecisions(Map.of(EmpReviewGroup.ABBREVIATIONS_AND_DEFINITIONS,
                                EmpIssuanceReviewDecision.builder().build()))
                        .reviewAttachments(Map.of(DOCUMENT_ID_2, "test"))
                        .build();

        EmissionsMonitoringPlan actualEmissionsMonitoringPlan = empVariationMapper
                .cloneEmissionsMonitoringPlan(emissionsMonitoringPlan, NAME, addressStateDTO);

        assertEmissionsMonitoringPlan(expectedRequestTaskPayload.getEmissionsMonitoringPlan(),
                actualEmissionsMonitoringPlan, addressStateDTO);
    }


    private void assertEmissionsMonitoringPlan(EmissionsMonitoringPlan expected,
                                               EmissionsMonitoringPlan actual,
                                               AddressStateDTO expectedAddressStateDTO) {
        assertEquals(expected.getAbbreviations(), actual.getAbbreviations());
        assertEquals(expected.getAdditionalDocuments(), actual.getAdditionalDocuments());
        assertEquals(expected.getControlActivities(), actual.getControlActivities());
        assertOperatorDetails(expected.getOperatorDetails(), actual.getOperatorDetails(), expectedAddressStateDTO);
        assertEquals(expected.getManagementProcedures(), actual.getManagementProcedures());
        assertEquals(expected.getDataGaps(), actual.getDataGaps());
        assertEquals(expected.getEmissions(), actual.getEmissions());
        assertEquals(expected.getSources(), actual.getSources());
        assertEquals(expected.getGreenhouseGas(), actual.getGreenhouseGas());

    }

    private void assertOperatorDetails(EmpOperatorDetails expected,
                                       EmpOperatorDetails actual,
                                       AddressStateDTO expectedAddressStateDTO) {
        assertEquals(NAME, actual.getOperatorName());
        assertEquals(expected.getImoNumber(), actual.getImoNumber());
        assertEquals(expectedAddressStateDTO, actual.getContactAddress());
        assertEquals(expected.getOrganisationStructure(), actual.getOrganisationStructure());
        assertEquals(expected.getDeclarationDocuments(), actual.getDeclarationDocuments());
        assertEquals(expected.getActivityDescription(), actual.getActivityDescription());
    }

    @Test
    void toEmissionsMonitoringPlanContainer() {
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
                .operatorDetails(EmpOperatorDetails.builder()
                        .operatorName("name1")
                        .organisationStructure(IndividualOrganisation.builder()
                                .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
                                .build())
                        .build())
                .abbreviations(EmpAbbreviations.builder()
                        .exist(true)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(true)
                        .build())
                .build();

        EmpVariationApplicationSubmitRequestTaskPayload taskPayload = EmpVariationApplicationSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .build();


        EmissionsMonitoringPlanContainer result = empVariationMapper.toEmissionsMonitoringPlanContainer(taskPayload);

        assertThat(result).isEqualTo(EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emp)
                .build());
    }

    @Test
    void toEmpVariationApplicationSubmitRequestTaskPayload() {
        String payloadType = "TEST_PAYLOAD";
        EmissionsMonitoringPlan emp = EmissionsMonitoringPlan.builder()
            .operatorDetails(EmpOperatorDetails.builder()
                .operatorName("name1")
                .organisationStructure(IndividualOrganisation.builder()
                    .legalStatusType(OrganisationLegalStatusType.INDIVIDUAL)
                    .build())
                .build())
            .abbreviations(EmpAbbreviations.builder()
                .exist(true)
                .build())
            .additionalDocuments(AdditionalDocuments.builder()
                .exist(true)
                .build())
            .build();

        Map<String, String> empSectionsCompleted = Map.of("a", "b");
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "test");
        String empVariationDetailsCompleted = "empVariationDetailsCompleted";
        EmpVariationDetails empVariationDetails = EmpVariationDetails.builder().otherSignificantChangeReason("test other").build();

        EmpVariationRequestPayload taskPayload = EmpVariationRequestPayload.builder()
            .emissionsMonitoringPlan(emp)
            .empVariationDetails(empVariationDetails)
            .empVariationDetailsCompleted(empVariationDetailsCompleted)
            .empAttachments(empAttachments)
            .empSectionsCompleted(empSectionsCompleted)
            .build();

        EmpVariationApplicationSubmitRequestTaskPayload expectedResult =
            EmpVariationApplicationSubmitRequestTaskPayload.builder()
                .emissionsMonitoringPlan(emp)
                .empVariationDetails(empVariationDetails)
                .empVariationDetailsCompleted(empVariationDetailsCompleted)
                .empAttachments(empAttachments)
                .empSectionsCompleted(empSectionsCompleted)
                .build();

        EmpVariationApplicationSubmitRequestTaskPayload result =
            empVariationMapper.toEmpVariationApplicationSubmitRequestTaskPayload(taskPayload, payloadType);

        assertThat(result.getEmissionsMonitoringPlan()).isEqualTo(expectedResult.getEmissionsMonitoringPlan());
        assertThat(result.getEmpVariationDetails()).isEqualTo(expectedResult.getEmpVariationDetails());
        assertThat(result.getEmpVariationDetailsCompleted()).isEqualTo(expectedResult.getEmpVariationDetailsCompleted());
        assertThat(result.getEmpAttachments()).isEqualTo(expectedResult.getEmpAttachments());
        assertThat(result.getEmpSectionsCompleted()).isEqualTo(expectedResult.getEmpSectionsCompleted());
    }
}