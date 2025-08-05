package uk.gov.mrtm.api.workflow.request.flow.accountclosure.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AccountClosureSaveRequestTaskActionPayload extends RequestTaskActionPayload {
	
	private AccountClosure accountClosure;
	
}
