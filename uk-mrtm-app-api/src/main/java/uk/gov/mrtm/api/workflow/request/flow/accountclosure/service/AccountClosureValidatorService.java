package uk.gov.mrtm.api.workflow.request.flow.accountclosure.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain.AccountClosure;

@Validated
@Service
@RequiredArgsConstructor
public class AccountClosureValidatorService {
	
	public void validateAccountClosureObject(@NotNull @Valid AccountClosure accountClosure) {
		// validate account closure object on final submit
	}

}
