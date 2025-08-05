package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;


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
public class EmpVariationSaveApplicationRegulatorLedRequestTaskActionPayload
        extends EmpVariationSaveApplicationRegulatorLedAbstractRequestTaskActionPayload {

    private EmpVariationRegulatorLedReason reasonRegulatorLed;
}
