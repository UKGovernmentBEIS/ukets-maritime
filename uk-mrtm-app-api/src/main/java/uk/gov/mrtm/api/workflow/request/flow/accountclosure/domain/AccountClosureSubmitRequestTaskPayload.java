package uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class AccountClosureSubmitRequestTaskPayload extends RequestTaskPayload {

	private AccountClosure accountClosure;
	
}
