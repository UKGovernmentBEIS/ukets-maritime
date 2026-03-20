package uk.gov.mrtm.api.mireport.system.verificationbodyusers;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.mireport.system.MiReportSystemResult;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class MaritimeVerificationBodyUsersMiReportResult extends MiReportSystemResult {

    private List<MaritimeVerificationBodyUser> results;
}
