package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewRequestPeerReviewValidatorServiceTest {
    private static final Long ACCOUNT_ID = 1L;

    @InjectMocks
    private EmpIssuanceReviewRequestPeerReviewValidatorService requestPeerReviewValidatorService;

    @Mock
    private PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;

    @Mock
    private EmpIssuanceReviewDeterminationValidatorService reviewDeterminationValidatorService;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private RequestTaskTypeService requestTaskTypeService;

    @Test
    void validate_is_valid() {
        String selectedPeerReviewer = "peerReviewer";
        AppUser appUser = AppUser.builder().userId("userId").build();
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder().type(determinationType).build();
        EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
                .determination(determination)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .payload(reviewRequestTaskPayload)
            .request(Request.builder().requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(ACCOUNT_ID)).resourceType(ResourceType.ACCOUNT).build())).build())
            .build();

        final RequestTaskType requestTaskType = mock(RequestTaskType.class);
        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW))
                .thenReturn(requestTaskType);

        when(reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, determinationType)).thenReturn(true);


        requestPeerReviewValidatorService.validate(requestTask, selectedPeerReviewer, appUser);

        verify(peerReviewerTaskAssignmentValidator, times(1))
                .validate(requestTask, requestTaskType, selectedPeerReviewer, appUser);
        verify(reviewDeterminationValidatorService, times(1)).validateDeterminationObject(determination);
        verify(reviewDeterminationValidatorService, times(1)).isValid(reviewRequestTaskPayload, determinationType);
        // TODO verify using exact arguments
        verify(empValidatorService, times(1)).validateEmissionsMonitoringPlan(any(EmissionsMonitoringPlanContainer.class), anyLong());
    }

    @Test
    void validate_throws_exception_when_invalid() {
        String selectedPeerReviewer = "peerReviewer";
        AppUser appUser = AppUser.builder().userId("userId").build();
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;
        EmpIssuanceDetermination determination = EmpIssuanceDetermination.builder().type(determinationType).build();
        EmpIssuanceApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_ISSUANCE_APPLICATION_REVIEW_PAYLOAD)
                .determination(determination)
                .build();
        RequestTask requestTask = RequestTask.builder()
            .payload(reviewRequestTaskPayload)
            .build();

        final RequestTaskType requestTaskType = mock(RequestTaskType.class);
        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_ISSUANCE_APPLICATION_PEER_REVIEW))
                .thenReturn(requestTaskType);

        when(reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, determinationType)).thenReturn(false);

        BusinessException be = assertThrows(BusinessException.class,
            () -> requestPeerReviewValidatorService.validate(requestTask, selectedPeerReviewer, appUser));

        assertEquals(ErrorCode.FORM_VALIDATION, be.getErrorCode());

        verify(peerReviewerTaskAssignmentValidator, times(1))
            .validate(requestTask, requestTaskType, selectedPeerReviewer, appUser);
        verify(reviewDeterminationValidatorService, times(1)).validateDeterminationObject(determination);
        verify(reviewDeterminationValidatorService, times(1)).isValid(reviewRequestTaskPayload, determinationType);
        verifyNoInteractions(empValidatorService);
    }
}