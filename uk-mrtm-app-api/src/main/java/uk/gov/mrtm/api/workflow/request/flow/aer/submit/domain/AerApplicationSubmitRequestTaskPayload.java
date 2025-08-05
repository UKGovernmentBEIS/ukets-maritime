package uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.EmpOriginatedData;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayloadVerifiable;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerApplicationSubmitRequestTaskPayload
    extends AerApplicationRequestTaskPayload implements RequestTaskPayloadVerifiable {

    private EmpOriginatedData empOriginatedData;

    private boolean verificationPerformed;

    private Long verificationBodyId;

}
