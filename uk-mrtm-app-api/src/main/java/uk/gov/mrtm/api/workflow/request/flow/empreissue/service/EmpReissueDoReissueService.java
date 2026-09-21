package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.time.LocalDateTime;

@Log4j2
@Service
@RequiredArgsConstructor
public class EmpReissueDoReissueService {

	private final RequestService requestService;
	private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	private final EmpReissueCreateEmpDocumentService empReissueCreateEmpDocumentService;
	private final EmpReissueOfficialNoticeService empReissueOfficialNoticeService;
	
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void doReissue(final String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final Long accountId = request.getAccountId();
		
		request.setSubmissionDate(LocalDateTime.now());
		
		int consolidationNumber = emissionsMonitoringPlanService.calculateNextConsolidationNumber(accountId);
		//TODO avoid setting calculated consolidation number
		setConsolidationNumberInMetadata(request, consolidationNumber);
		setConsolidationNumberInRequestPayload(request, consolidationNumber);
		
		final String asyncJobEmpId = empReissueCreateEmpDocumentService.create(request);
		log.info("Emp file with process id {} is being generated asynchronously for request id {}",
				asyncJobEmpId, requestId);
		
		final String asyncJobOfficialNoticeId = empReissueOfficialNoticeService.generateOfficialNotice(request);
		log.info("Official notice file with process id {} is being generated asynchronously for request id {}",
				asyncJobOfficialNoticeId, requestId);
	}

	private void setConsolidationNumberInMetadata(Request request, int consolidationNumber){
		EmpReissueRequestMetadata data = (EmpReissueRequestMetadata) request.getMetadata();
		data.setEmpConsolidationNumber(consolidationNumber);
	}
	
	private void setConsolidationNumberInRequestPayload(Request request, int consolidationNumber){
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		requestPayload.setConsolidationNumber(consolidationNumber);
	}
	
}
