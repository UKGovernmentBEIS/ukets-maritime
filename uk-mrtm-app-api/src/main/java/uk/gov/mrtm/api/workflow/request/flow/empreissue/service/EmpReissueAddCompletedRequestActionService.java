package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper.EmpReissueMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

@Service
@RequiredArgsConstructor
public class EmpReissueAddCompletedRequestActionService {

	private final RequestService requestService;
	private final RequestActionUserInfoResolver requestActionUserInfoResolver;
	private static final EmpReissueMapper REISSUE_MAPPER = Mappers.getMapper(EmpReissueMapper.class);
	
	@Transactional
	public void add(final String requestId) {
		final Request request = requestService.findRequestById(requestId);
		final EmpReissueRequestPayload requestPayload = (EmpReissueRequestPayload) request.getPayload();
		final EmpReissueRequestMetadata requestMetadata = (EmpReissueRequestMetadata) request.getMetadata();
		final String signatoryName = requestActionUserInfoResolver.getUserFullName(requestMetadata.getSignatory());

		final EmpReissueCompletedRequestActionPayload actionPayload = REISSUE_MAPPER.toCompletedActionPayload(
				requestPayload, requestMetadata, signatoryName, MrtmRequestActionPayloadType.EMP_REISSUE_COMPLETED_PAYLOAD);

		requestService.addActionToRequest(request, 
				actionPayload, 
				MrtmRequestActionType.EMP_REISSUE_COMPLETED,
				requestMetadata.getSubmitterId());
	}
}
