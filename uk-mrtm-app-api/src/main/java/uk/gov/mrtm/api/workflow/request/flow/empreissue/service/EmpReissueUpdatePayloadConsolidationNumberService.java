package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.workflow.request.core.domain.Request;

@Service
@RequiredArgsConstructor
class EmpReissueUpdatePayloadConsolidationNumberService {

	private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	
	@Transactional
	public void updateRequestPayloadConsolidationNumber(Request request) {
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		int consolidationNumber = emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanConsolidationNumberByAccountId(request.getAccountId());
		requestPayload.setConsolidationNumber(consolidationNumber);
	}
}
