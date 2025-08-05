package uk.gov.mrtm.api.workflow.request.flow.doe.common.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;

@Service
@Validated
public class DoeValidatorService {

    public void validateDoe(@NotNull @Valid Doe doe) {
        //validates doe
    }
}