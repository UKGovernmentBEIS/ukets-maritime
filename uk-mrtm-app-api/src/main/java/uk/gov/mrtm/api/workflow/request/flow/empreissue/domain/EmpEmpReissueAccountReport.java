package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpEmpReissueAccountReport extends EmpReissueReport {

    private String empId;
    private String accountName;

}
