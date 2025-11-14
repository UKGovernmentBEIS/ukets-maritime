package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueReport;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class EmpReissueCompletedService {

	private final RequestService requestService;

	@Transactional
	public void reissueCompleted(String batchRequestId, Long accountId, boolean succeeded, boolean lock) {
		final Request request = lock ? requestService.findRequestByIdForUpdate(batchRequestId)
				: requestService.findRequestById(batchRequestId);
		
		// update report metadata
		EmpBatchReissueRequestMetadata metadata = (EmpBatchReissueRequestMetadata) request.getMetadata();
		EmpReissueReport report = metadata.getAccountsReports().get(accountId);
		report.setSucceeded(succeeded);
		
		if(succeeded) {
			report.setIssueDate(LocalDate.now());
		}
	}
}
