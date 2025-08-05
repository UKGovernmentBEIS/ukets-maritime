package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.mapper.EmpReviewMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

@Service
@RequiredArgsConstructor
public class EmpIssuanceReviewRequestPeerReviewValidatorService {

    private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
    private final EmpIssuanceReviewDeterminationValidatorService reviewDeterminationValidatorService;
    private final EmpValidatorService empValidatorService;
    private final RequestTaskTypeService requestTaskTypeService;
    private static final EmpReviewMapper EMP_REVIEW_MAPPER = Mappers.getMapper(EmpReviewMapper.class);

    public void validate(RequestTask requestTask, String selectedPeerReviewer, AppUser appUser) {
       
        peerReviewerTaskAssignmentValidator.validate(requestTask,
                requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW),
                selectedPeerReviewer,
                appUser);

        EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            (EmpIssuanceApplicationReviewRequestTaskPayload) requestTask.getPayload();

        validateDetermination(reviewRequestTaskPayload);
        validateEmissionsMonitoringPlan(reviewRequestTaskPayload, requestTask.getRequest().getAccountId());
    }

    private void validateDetermination(EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload) {
        EmpIssuanceDetermination reviewDetermination = reviewRequestTaskPayload.getDetermination();

        reviewDeterminationValidatorService.validateDeterminationObject(reviewDetermination);

        if (!reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, reviewDetermination.getType())) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }

    private void validateEmissionsMonitoringPlan(EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload, Long accountId) {
        EmissionsMonitoringPlanContainer empContainer = EMP_REVIEW_MAPPER.toEmissionsMonitoringPlanContainer(reviewRequestTaskPayload);
        empValidatorService.validateEmissionsMonitoringPlan(empContainer, accountId);
    }
}
