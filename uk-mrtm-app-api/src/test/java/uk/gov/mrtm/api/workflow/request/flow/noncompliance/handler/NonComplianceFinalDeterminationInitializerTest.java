package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceReason;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class NonComplianceFinalDeterminationInitializerTest {

    @InjectMocks
    private NonComplianceFinalDeterminationInitializer initializer;

    @Test
    void initializePayload() {
        NonComplianceReason reason = NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN;
        String nonComplianceComments = "nonComplianceComments";
        LocalDate complianceDate = LocalDate.now().minusMonths(2);
        LocalDate nonComplianceDate = LocalDate.now().minusMonths(1);

        final Request request = Request.builder()
            .payload(
                NonComplianceRequestPayload.builder()
                    .reason(reason)
                    .nonComplianceComments(nonComplianceComments)
                    .complianceDate(complianceDate)
                    .nonComplianceDate(nonComplianceDate)
                    .build()
            )
            .build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceFinalDeterminationRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_FINAL_DETERMINATION_PAYLOAD)
            .reason(reason)
            .nonComplianceComments(nonComplianceComments)
            .complianceDate(complianceDate)
            .nonComplianceDate(nonComplianceDate)
            .build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes()).containsExactlyInAnyOrder(
            MrtmRequestTaskType.NON_COMPLIANCE_FINAL_DETERMINATION);
    }

}
