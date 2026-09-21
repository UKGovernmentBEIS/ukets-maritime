package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueReport;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmpReissueCompletedService {

	private final RequestService requestService;
	private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	private final EmpReissueAddCompletedRequestActionService empReissueAddCompletedRequestActionService;
	private final EmpReissueOfficialNoticeService empReissueOfficialNoticeService;
 
	@Transactional
	public void reissueCompleted(String requestId, String batchRequestId, Long accountId, boolean succeeded) {
		final Request request = requestService.findRequestById(requestId);
		final Request batchRequest = requestService.findRequestByIdForUpdate(batchRequestId);
		
		final EmpBatchReissueRequestMetadata batchMetadata = (EmpBatchReissueRequestMetadata) batchRequest.getMetadata();
		final EmpReissueReport report = batchMetadata.getAccountsReports().get(accountId);
		report.setSucceeded(succeeded);
		
		if(succeeded) {
			report.setIssueDate(LocalDate.now());
			
			//do increment consolidation number
			emissionsMonitoringPlanService.incrementEmpConsolidationNumber(accountId);

			//send official notice
			empReissueOfficialNoticeService.sendOfficialNotice(request);
			
			// add request action
			empReissueAddCompletedRequestActionService.add(request.getId());
		}
		
	}
}
