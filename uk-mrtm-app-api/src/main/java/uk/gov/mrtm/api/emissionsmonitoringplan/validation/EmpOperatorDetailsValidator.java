package uk.gov.mrtm.api.emissionsmonitoringplan.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.service.MrtmAccountQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanValidationResult;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.operatordetails.EmpOperatorDetails;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpOperatorDetailsValidator implements EmpContextValidator{

    private final MrtmAccountQueryService accountQueryService;

    public EmissionsMonitoringPlanValidationResult validate(EmissionsMonitoringPlanContainer empContainer,
                                                            Long accountId) {

        List<EmissionsMonitoringPlanViolation> empViolations = new ArrayList<>();
        final String imoNumber = empContainer.getEmissionsMonitoringPlan().getOperatorDetails().getImoNumber();
        if (!accountQueryService.existsByImoNumberAndId(imoNumber, accountId)) {
            empViolations.add(new EmissionsMonitoringPlanViolation(EmpOperatorDetails.class.getSimpleName(),
                    EmissionsMonitoringPlanViolation.ViolationMessage.INVALID_IMO_NUMBER, imoNumber));
        }
        return EmissionsMonitoringPlanValidationResult.builder()
                .valid(empViolations.isEmpty())
                .empViolations(empViolations)
                .build();
    }
}
