package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceReason;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class NonComplianceCivilPenaltyInitializerTest {

    @InjectMocks
    private NonComplianceCivilPenaltyInitializer initializer;

    @Test
    void initializePayload_whenReissueCivilPenaltyIsFalse_thenCopyFromRequest() {
        String comments = "comments";
        UUID civilPenalty = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("B", "COMPLETED");
        BigDecimal penaltyAmount = BigDecimal.ONE;
        LocalDate civilPenaltyDueDate = LocalDate.now();

        NonComplianceReason reason = NonComplianceReason.FAILURE_TO_APPLY_FOR_AN_EMISSIONS_MONITORING_PLAN;
        String nonComplianceComments = "nonComplianceComments";
        LocalDate complianceDate = LocalDate.now().minusMonths(2);
        LocalDate nonComplianceDate = LocalDate.now().minusMonths(1);

        final Request request = Request.builder()
            .payload(NonComplianceRequestPayload.builder()
                .reIssueCivilPenalty(true)
                .civilPenalty(civilPenalty)
                .civilPenaltyAmount(penaltyAmount)
                .civilPenaltyDueDate(civilPenaltyDueDate)
                .civilPenaltyComments(comments)
                .nonComplianceAttachments(attachments)
                .reason(reason)
                .nonComplianceComments(nonComplianceComments)
                .complianceDate(complianceDate)
                .nonComplianceDate(nonComplianceDate)
                .civilPenaltySectionsCompleted(sectionsCompleted)
                .build()
            )
            .build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceCivilPenaltyRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_PAYLOAD)
            .reason(reason)
            .nonComplianceComments(nonComplianceComments)
            .complianceDate(complianceDate)
            .nonComplianceDate(nonComplianceDate)
            .build());
    }

    @Test
    void initializePayload_whenReissueCivilPenaltyIsTrue_thenFreshPayload() {
        String comments = "comments";
        UUID civilPenalty = UUID.randomUUID();
        Map<UUID, String> attachments = Map.of(UUID.randomUUID(), "filename.txt");
        Map<String, String> sectionsCompleted = Map.of("B", "COMPLETED");
        BigDecimal penaltyAmount = BigDecimal.ONE;
        LocalDate civilPenaltyDueDate = LocalDate.now();

        final Request request = Request.builder()
            .payload(NonComplianceRequestPayload.builder()
                .reIssueCivilPenalty(false)
                .civilPenalty(civilPenalty)
                .civilPenaltyAmount(penaltyAmount)
                .civilPenaltyDueDate(civilPenaltyDueDate)
                .civilPenaltyComments(comments)
                .nonComplianceAttachments(attachments)
                .civilPenaltySectionsCompleted(sectionsCompleted)
                .build()
            )
            .build();

        final RequestTaskPayload requestTaskPayload = initializer.initializePayload(request);

        assertEquals(requestTaskPayload, NonComplianceCivilPenaltyRequestTaskPayload.builder()
            .payloadType(MrtmRequestTaskPayloadType.NON_COMPLIANCE_CIVIL_PENALTY_PAYLOAD)
            .civilPenalty(civilPenalty)
            .penaltyAmount(penaltyAmount)
            .dueDate(civilPenaltyDueDate)
            .comments(comments)
            .nonComplianceAttachments(attachments)
            .sectionsCompleted(sectionsCompleted)
            .build());
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(initializer.getRequestTaskTypes())
            .containsExactlyInAnyOrder(MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY);
    }

}
