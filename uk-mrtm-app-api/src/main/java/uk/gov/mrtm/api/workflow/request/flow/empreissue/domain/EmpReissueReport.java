package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class EmpReissueReport {

    private LocalDate issueDate;
    private boolean succeeded;

}
