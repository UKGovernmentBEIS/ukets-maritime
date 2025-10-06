package uk.gov.mrtm.api.workflow.request.flow.doe.common.handler.flowable;

import lombok.RequiredArgsConstructor;
import org.flowable.engine.delegate.DelegateExecution;
import org.flowable.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.service.DoePopulateRequestMetadataWithReportableEmissionsService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;

@Service
@RequiredArgsConstructor
public class DoePopulateRequestMetadataWithReportableEmissionsHandlerFlowable implements JavaDelegate {

	private final DoePopulateRequestMetadataWithReportableEmissionsService service;
	
	@Override
	public void execute(DelegateExecution execution) {
		final String requestId = (String) execution.getVariable(BpmnProcessConstants.REQUEST_ID);
		service.updateRequestMetadata(requestId);
	}

}
