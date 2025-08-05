package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmpReissueDoReissueService {

	private final RequestService requestService;
	private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	private final EmpReissueUpdatePayloadConsolidationNumberService empReissueUpdatePayloadConsolidationNumberService;
	private final EmpReissueGenerateDocumentsService empReissueGenerateDocumentsService;
	private final EmpReissueAddCompletedRequestActionService empReissueAddCompletedRequestActionService;
	private final EmpReissueOfficialNoticeService empReissueOfficialNoticeService;

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void doReissue(final String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final Long accountId = request.getAccountId();
		
		request.setSubmissionDate(LocalDateTime.now());
		
		int consolidationNumber = emissionsMonitoringPlanService.incrementEmpConsolidationNumber(accountId);

		setConsolidationNumberInMetadata(request, consolidationNumber);
		
		empReissueUpdatePayloadConsolidationNumberService.updateRequestPayloadConsolidationNumber(request);

		empReissueGenerateDocumentsService.generateDocuments(request);

		empReissueAddCompletedRequestActionService.add(requestId);
		
		empReissueOfficialNoticeService.sendOfficialNotice(request);
	}

	private void setConsolidationNumberInMetadata(Request request, int consolidationNumber){
		EmpReissueRequestMetadata data = (EmpReissueRequestMetadata) request.getMetadata();
		data.setEmpConsolidationNumber(consolidationNumber);
	}
	
}
