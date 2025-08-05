package uk.gov.mrtm.api.workflow.request.flow.noncompliance.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.ComplianceRestored;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDetermination;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;

import java.time.LocalDate;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class NonComplianceFinalDeterminationApplyServiceTest {

    @InjectMocks
    private NonComplianceFinalDeterminationApplyService service;

    @Test
    void applySaveAction() {

        final NonComplianceFinalDeterminationRequestTaskPayload taskPayload =
            NonComplianceFinalDeterminationRequestTaskPayload.builder()
                .sectionsCompleted(Map.of("section_b", "incomplete"))
                .finalDetermination(
                    NonComplianceFinalDetermination.builder()
                        .complianceRestored(ComplianceRestored.NOT_APPLICABLE)
                        .complianceRestoredDate(LocalDate.of(2025, 2, 5))
                        .comments("old comments")
                        .reissuePenalty(false)
                        .operatorPaid(false)
                        .operatorPaidDate(LocalDate.of(2024, 5, 1))
                        .build())
                .build();
        final RequestTask requestTask = RequestTask.builder().payload(taskPayload).build();

        final NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload taskActionPayload =
            NonComplianceFinalDeterminationSaveApplicationRequestTaskActionPayload.builder()
                .finalDetermination(NonComplianceFinalDetermination.builder()
                    .complianceRestored(ComplianceRestored.NO)
                    .complianceRestoredDate(LocalDate.of(2021, 1, 2))
                    .comments("comments")
                    .reissuePenalty(true)
                    .operatorPaid(true)
                    .operatorPaidDate(LocalDate.of(2021, 2, 5))
                    .build())
                .sectionsCompleted(Map.of("section_a", "completed"))
                .build();

        service.applySaveAction(requestTask, taskActionPayload);

        assertEquals(taskPayload.getFinalDetermination(), taskActionPayload.getFinalDetermination());
        assertEquals(taskPayload.getSectionsCompleted(), taskActionPayload.getSectionsCompleted());
    }
}
