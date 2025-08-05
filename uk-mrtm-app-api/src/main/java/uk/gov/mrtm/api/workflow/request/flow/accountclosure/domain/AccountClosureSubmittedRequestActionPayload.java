package uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AccountClosureSubmittedRequestActionPayload extends RequestActionPayload {

	private AccountClosure accountClosure;
	
}
