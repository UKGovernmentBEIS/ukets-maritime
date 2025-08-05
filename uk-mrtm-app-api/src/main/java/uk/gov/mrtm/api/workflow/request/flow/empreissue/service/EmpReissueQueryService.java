package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

@Service
@RequiredArgsConstructor
public class EmpReissueQueryService {

	private final RequestService requestService;
	
	public Request getBatchRequest(Request reissueRequest) {
		final EmpReissueRequestMetadata metadata = (EmpReissueRequestMetadata) reissueRequest.getMetadata();
		final String batchReissueId = metadata.getBatchRequestId();
		return requestService.findRequestById(batchReissueId);
	}
}
