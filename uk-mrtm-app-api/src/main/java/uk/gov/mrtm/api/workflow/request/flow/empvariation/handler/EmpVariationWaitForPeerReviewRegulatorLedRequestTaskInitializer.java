package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationSubmitRegulatorLedMapper;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.InitializeRequestTaskHandler;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class EmpVariationWaitForPeerReviewRegulatorLedRequestTaskInitializer implements InitializeRequestTaskHandler {
	
	private static final EmpVariationSubmitRegulatorLedMapper MAPPER = Mappers.getMapper(EmpVariationSubmitRegulatorLedMapper.class);
	
	@Override
	public RequestTaskPayload initializePayload(Request request) {
		final EmpVariationRequestPayload requestPayload = (EmpVariationRequestPayload) request.getPayload();
        
        return MAPPER.toEmpVariationApplicationSubmitRegulatorLedRequestTaskPayload(
                requestPayload, MrtmRequestTaskPayloadType.EMP_VARIATION_WAIT_FOR_PEER_REVIEW_REGULATOR_LED_PAYLOAD
            );
	}

	@Override
	public Set<String> getRequestTaskTypes() {
		return Set.of(MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_WAIT_FOR_PEER_REVIEW);
	}

}
