package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

@Service
@RequiredArgsConstructor
public class EmpVariationRequestPeerReviewRegulatorLedValidator {

	private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
	private final RequestTaskTypeService requestTaskTypeService;
	private final EmpVariationRegulatorLedValidator empValidator;

	public void validate(final RequestTask requestTask, final PeerReviewRequestTaskActionPayload payload,
						 final AppUser appUser) {
		peerReviewerTaskAssignmentValidator.validate(requestTask,
				requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_VARIATION_REGULATOR_LED_APPLICATION_PEER_REVIEW),
				payload.getPeerReviewer(),
				appUser);

		EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload requestTaskPayload = (EmpVariationApplicationSubmitRegulatorLedRequestTaskPayload) requestTask.getPayload();

		empValidator.validateEmp(requestTaskPayload, requestTask.getRequest().getAccountId());
	}
}
