package uk.gov.mrtm.api.workflow.request.flow.aer.common.service;

import org.apache.commons.lang3.BooleanUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.aer.submit.domain.AerApplicationSubmitRequestTaskPayload;

@Service
public class AerSubmitRequestTaskSyncAerAttachmentsService {

	public void sync(Boolean reportingRequired, AerApplicationSubmitRequestTaskPayload requestTaskPayload) {
		// handle aer attachments
        if(BooleanUtils.isTrue(reportingRequired) && BooleanUtils.isNotTrue(requestTaskPayload.getReportingRequired())) {
        	refreshAerAttachmentsUponReportingObligationTrue(requestTaskPayload);
        } else {
        	// do nothing
        }
	}
	
	private void refreshAerAttachmentsUponReportingObligationTrue(AerApplicationSubmitRequestTaskPayload requestTaskPayload) {
		requestTaskPayload.getAerAttachments().clear();
		// load from emp originated data
    	requestTaskPayload.getAerAttachments().putAll(requestTaskPayload.getEmpOriginatedData().getOperatorDetailsAttachments());
	}
}
