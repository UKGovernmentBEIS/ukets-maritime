package uk.gov.mrtm.api.integration.registry.accountexempt.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountExemptEvent {
    private Long accountId;
    private Year year;
    private boolean isExempt;
}
