package uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.transform;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.additionaldocuments.AdditionalDocuments;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.submit.domain.EmpIssuanceRequestPayload;

import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;

class EmpSubmitMapperTest {

    private EmpSubmitMapper mapper = Mappers.getMapper(EmpSubmitMapper.class);

    @Test
    void toEmissionsMonitoringPlanContainer() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(false)
                        .build())
                .build();
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                        .emissionsMonitoringPlan(emissionsMonitoringPlan)
                        .build();

        EmissionsMonitoringPlanContainer expectedEmpContainer = EmissionsMonitoringPlanContainer.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .build();

        assertEquals(expectedEmpContainer, mapper.toEmissionsMonitoringPlanContainer(requestTaskPayload));
    }

    @Test
    void toEmpIssuanceApplicationSubmittedRequestActionPayload() {
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(false)
                        .build())
                .build();
        Map<String, String> empSectionsCompleted = Map.of("Section A", "completed");
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "attachmentName");
        EmpIssuanceApplicationSubmitRequestTaskPayload requestTaskPayload =
                EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                        .emissionsMonitoringPlan(emissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .empAttachments(empAttachments)
                        .build();


        EmissionsMonitoringPlan expectedEmissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
                .abbreviations(EmpAbbreviations.builder()
                        .exist(false)
                        .build())
                .additionalDocuments(AdditionalDocuments.builder()
                        .exist(false)
                        .build())
                .build();

        EmpIssuanceApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
                EmpIssuanceApplicationSubmittedRequestActionPayload.builder()
                        .payloadType(MrtmRequestActionPayloadType.EMP_ISSUANCE_APPLICATION_SUBMITTED_PAYLOAD)
                        .emissionsMonitoringPlan(expectedEmissionsMonitoringPlan)
                        .empSectionsCompleted(empSectionsCompleted)
                        .empAttachments(empAttachments)
                        .build();

        assertEquals(expectedRequestActionPayload, mapper.toEmpIssuanceApplicationSubmittedRequestActionPayload(requestTaskPayload));
    }

    @Test
    void toEmpIssuanceApplicationSubmitRequestTaskPayload() {
        String payloadType = "TEST_PAYLOAD";
        EmissionsMonitoringPlan emissionsMonitoringPlan = EmissionsMonitoringPlan.builder()
            .abbreviations(EmpAbbreviations.builder()
                .exist(false)
                .build())
            .additionalDocuments(AdditionalDocuments.builder()
                .exist(false)
                .build())
            .build();
        Map<String, String> empSectionsCompleted = Map.of("Section A", "completed");
        Map<UUID, String> empAttachments = Map.of(UUID.randomUUID(), "attachmentName");
        EmpIssuanceRequestPayload requestPayload =
            EmpIssuanceRequestPayload.builder()
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(empSectionsCompleted)
                .empAttachments(empAttachments)
                .build();

        EmpIssuanceApplicationSubmitRequestTaskPayload expectedRequestActionPayload =
            EmpIssuanceApplicationSubmitRequestTaskPayload.builder()
                .payloadType(payloadType)
                .emissionsMonitoringPlan(emissionsMonitoringPlan)
                .empSectionsCompleted(empSectionsCompleted)
                .empAttachments(empAttachments)
                .build();


        assertEquals(expectedRequestActionPayload, mapper.toEmpIssuanceApplicationSubmitRequestTaskPayload(requestPayload, payloadType));
    }
}
