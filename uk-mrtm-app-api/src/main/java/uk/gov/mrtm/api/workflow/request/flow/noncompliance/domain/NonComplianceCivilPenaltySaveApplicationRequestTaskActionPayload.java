package uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class NonComplianceCivilPenaltySaveApplicationRequestTaskActionPayload extends RequestTaskActionPayload {

    @NotNull
    private UUID civilPenalty;

    @NotNull
    @Positive
    @Digits(integer = Integer.MAX_VALUE, fraction = 2)
    private BigDecimal penaltyAmount;

    private LocalDate dueDate;
    
    @Size(max = 10000)
    private String comments;

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();
}
