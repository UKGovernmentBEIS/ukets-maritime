package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mapstruct.factory.Mappers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.validation.EmpValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDetermination;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.mapper.EmpVariationMapper;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationReviewRequestPeerReviewValidatorServiceTest {

	@InjectMocks
    private EmpVariationReviewRequestPeerReviewValidatorService requestPeerReviewValidatorService;

    @Mock
    private PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;

    @Mock
    private EmpVariationReviewDeterminationValidatorService reviewDeterminationValidatorService;

    @Mock
    private EmpValidatorService empValidatorService;

    @Mock
    private RequestTaskTypeService requestTaskTypeService;

    @Test
    void validate_is_valid() {
        Long accountId = 1L;
        Request request = Request.builder().requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        String selectedPeerReviewer = "peerReviewer";
        AppUser appUser = AppUser.builder().userId("userId").build();
        EmpVariationDeterminationType determinationType = EmpVariationDeterminationType.APPROVED;
        EmpVariationDetermination determination = EmpVariationDetermination.builder().type(determinationType).build();
        EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
        		EmpVariationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                .determination(determination)
                .build();
        RequestTask requestTask = RequestTask.builder().request(request).payload(reviewRequestTaskPayload).build();

        when(reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, determinationType)).thenReturn(true);
        
        requestPeerReviewValidatorService.validate(requestTask, selectedPeerReviewer, appUser);

        verify(empValidatorService, times(1))
            .validateEmissionsMonitoringPlan(Mappers.getMapper(EmpVariationMapper.class).toEmissionsMonitoringPlanContainer(reviewRequestTaskPayload), accountId);
        verify(reviewDeterminationValidatorService, times(1)).validateDeterminationObject(determination);
        verify(reviewDeterminationValidatorService, times(1)).isValid(reviewRequestTaskPayload, determinationType);
        verify(empValidatorService, times(1)).validateEmissionsMonitoringPlan(any(EmissionsMonitoringPlanContainer.class), anyLong());
    }

    @Test
    void validate_throws_exception_when_invalid() {
        Long accountId = 1L;
        Request request = Request.builder().requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId)).resourceType(ResourceType.ACCOUNT).build())).build();
        String selectedPeerReviewer = "peerReviewer";
        AppUser appUser = AppUser.builder().userId("userId").build();
        EmpVariationDeterminationType determinationType = EmpVariationDeterminationType.APPROVED;
        EmpVariationDetermination determination = EmpVariationDetermination.builder().type(determinationType).build();
        EmpVariationApplicationReviewRequestTaskPayload reviewRequestTaskPayload =
        		EmpVariationApplicationReviewRequestTaskPayload.builder()
                .payloadType(MrtmRequestTaskPayloadType.EMP_VARIATION_APPLICATION_REVIEW_PAYLOAD)
                .determination(determination)
                .build();
        RequestTask requestTask = RequestTask.builder().request(request).payload(reviewRequestTaskPayload).build();

        when(reviewDeterminationValidatorService.isValid(reviewRequestTaskPayload, determinationType)).thenReturn(false);

        BusinessException be = assertThrows(BusinessException.class,
            () -> requestPeerReviewValidatorService.validate(requestTask, selectedPeerReviewer, appUser));

        assertEquals(ErrorCode.FORM_VALIDATION, be.getErrorCode());

        verify(reviewDeterminationValidatorService, times(1)).validateDeterminationObject(determination);
        verify(reviewDeterminationValidatorService, times(1)).isValid(reviewRequestTaskPayload, determinationType);
        verifyNoInteractions(empValidatorService);
    }
}
