package uk.gov.mrtm.api.workflow.request.flow.common.jsonprovider;

import com.fasterxml.jackson.databind.jsontype.NamedType;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.submit.AerSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.aer.verification.AerVerificationSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empissuance.EmpIssuanceSubmitRequestFeedbackPayload;
import uk.gov.mrtm.api.workflow.request.feedback.domain.empvariation.EmpVariationSubmitRequestFeedbackPayload;
import uk.gov.netz.api.common.config.jackson.JsonSubTypesProvider;

import java.util.List;

import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestFeedbackPayloadType.AER_SUBMIT_PAYLOAD;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestFeedbackPayloadType.AER_VERIFICATION_SUBMIT_PAYLOAD;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestFeedbackPayloadType.EMP_ISSUANCE_SUBMIT_PAYLOAD;
import static uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestFeedbackPayloadType.EMP_VARIATION_SUBMIT_PAYLOAD;

@Component
public class RequestFeedbackPayloadTypesProvider implements JsonSubTypesProvider {

	@Override
	public List<NamedType> getTypes() {
		return List.of(
				new NamedType(AerSubmitRequestFeedbackPayload.class, AER_SUBMIT_PAYLOAD),
				new NamedType(AerVerificationSubmitRequestFeedbackPayload.class, AER_VERIFICATION_SUBMIT_PAYLOAD),
				new NamedType(EmpIssuanceSubmitRequestFeedbackPayload.class, EMP_ISSUANCE_SUBMIT_PAYLOAD),
				new NamedType(EmpVariationSubmitRequestFeedbackPayload.class, EMP_VARIATION_SUBMIT_PAYLOAD)
		);
	}

}
