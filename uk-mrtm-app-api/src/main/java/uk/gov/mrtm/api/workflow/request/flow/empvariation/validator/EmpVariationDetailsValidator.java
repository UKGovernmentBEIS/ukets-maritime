package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetails;

@Service
@Validated
public class EmpVariationDetailsValidator {

    public void validate(@Valid @NotNull EmpVariationDetails empVariationDetails) {
        //Trigger validations
    }

}
