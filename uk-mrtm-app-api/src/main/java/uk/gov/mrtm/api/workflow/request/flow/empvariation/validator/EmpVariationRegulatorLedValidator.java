package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRegulatorLedReason;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;

@Service
@Validated
@RequiredArgsConstructor
public class EmpVariationRegulatorLedValidator {

    public void validateRegulatorLedReason(@Valid @NotNull EmpVariationRegulatorLedReason reasonRegulatorLed) {
        //Trigger validations
    }

    private final EmpValidatorService empValidatorService;
    private final EmpVariationDetailsValidator empVariationDetailsValidator;
    private static final EmpVariationMapper MAPPER = Mappers.getMapper(EmpVariationMapper.class);

    public void validateEmp(EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload requestTaskPayload, Long accountId) {
        EmissionsMonitoringPlanContainer empContainer = MAPPER.toEmissionsMonitoringPlanContainer(requestTaskPayload);
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId);
        empVariationDetailsValidator.validate(requestTaskPayload.getEmpVariationDetails());
    }

}
