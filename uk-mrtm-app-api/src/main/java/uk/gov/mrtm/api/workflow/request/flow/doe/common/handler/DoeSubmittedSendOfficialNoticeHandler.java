package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler;

import lombok.RequiredArgsConstructor;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoeOfficialNoticeSendService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class DoeSubmittedSendOfficialNoticeHandler implements JavaDelegate {

	private final DoeOfficialNoticeSendService doeOfficialNoticeSendService;
	
	@Override
	public void execute(DelegateExecution execution) throws Exception {
		String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
		doeOfficialNoticeSendService.sendOfficialNotice(requestId);
	}
}