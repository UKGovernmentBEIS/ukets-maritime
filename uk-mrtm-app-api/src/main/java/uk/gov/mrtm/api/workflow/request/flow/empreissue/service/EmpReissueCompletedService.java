package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueReport;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmpReissueCompletedService {

	private final RequestService requestService;

	@Transactional
	public void reissueCompleted(String requestId, Long accountId, boolean succeeded) {
		final Request request = requestService.findRequestById(requestId);
		
		// update report metadata
		EmpBatchReissueRequestMetadata metadata = (EmpBatchReissueRequestMetadata) request.getMetadata();
		EmpReissueReport report = metadata.getAccountsReports().get(accountId);
		report.setSucceeded(succeeded);
		
		if(succeeded) {
			report.setIssueDate(LocalDate.now());
		}
	}
}
