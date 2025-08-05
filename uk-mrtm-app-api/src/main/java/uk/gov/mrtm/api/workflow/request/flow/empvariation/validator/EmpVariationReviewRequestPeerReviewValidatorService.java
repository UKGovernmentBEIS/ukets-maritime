package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

@Service
@RequiredArgsConstructor
public class EmpVariationReviewRequestPeerReviewValidatorService {

	private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
    private final RequestTaskTypeService requestTaskTypeService;
    private final EmpVariationReviewDeterminationValidatorService reviewDeterminationValidatorService;
    private final EmpValidatorService empValidatorService;
    private static final EmpVariationMapper MAPPER = Mappers.getMapper(EmpVariationMapper.class);

    public void validate(RequestTask requestTask, String selectedPeerReviewer, AppUser appUser) {
        Request request = requestTask.getRequest();

        peerReviewerTaskAssignmentValidator.validate(
            requestTask,
                requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_PEER_REVIEW),
            selectedPeerReviewer,
                appUser);

        EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            (EmpVariationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        validateDetermination(reviewRequestTaskPayload);
        validateEmissionsMonitoringPlan(reviewRequestTaskPayload, request);
    }
    private void validateDetermination(EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload) {
        EmpVariationDetermination reviewDetermination = reviewRequestTaskPayload.getDetermination();

        reviewDeterminationValidatorService.validateDeterminationObject(reviewDetermination);

        if (!reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, reviewDetermination.getType())) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }

    private void validateEmissionsMonitoringPlan(EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload, Request request) {
        EmissionsMonitoringPlanContainer empContainer = MAPPER.toEmissionsMonitoringPlanContainer(reviewRequestTaskPayload);
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, request.getAccountId());
    }
}
