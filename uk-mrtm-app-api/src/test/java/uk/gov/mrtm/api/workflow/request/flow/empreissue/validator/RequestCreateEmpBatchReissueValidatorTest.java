package uk.gov.mrtm.api.workflow.request.flow.empreissue.validator;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestCreateActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RequestCreateEmpBatchReissueValidatorTest {

	@InjectMocks
    private RequestCreateEmpBatchReissueValidator cut;
    
    @Mock
    private RequestQueryService requestQueryService;
    
    @Mock
    private EmpBatchReissueQueryService empBatchReissueQueryService;

	@Mock
	private RequestTypeRepository requestTypeRepository;
    
    @Test
    void getType() {
    	assertThat(cut.getRequestType()).isEqualTo(MrtmRequestType.EMP_BATCH_REISSUE);
    }
    
    @Test
    void validateAction() {
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
		RequestType requestType = RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build();

    	EmpBatchReissueRequestCreateActionPayload payload = EmpBatchReissueRequestCreateActionPayload.builder()
				.summary("summary")
    			.build();
		when(requestTypeRepository.findByCode(any())).thenReturn(Optional.of(requestType));
    	when(requestQueryService.existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority))
    		.thenReturn(false);
    	
    	when(empBatchReissueQueryService.existAccountsByCA(competentAuthority))
			.thenReturn(true);
    	
    	cut.validateAction(competentAuthority, payload);
    	
    	verify(requestQueryService, times(1)).existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority);
    	verify(empBatchReissueQueryService, times(1)).existAccountsByCA(competentAuthority);
    }
    
    @Test
    void validateAction_in_progress_exist_error() {
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
		RequestType requestType = RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build();

    	EmpBatchReissueRequestCreateActionPayload payload = EmpBatchReissueRequestCreateActionPayload.builder()
				.summary("summary")
    			.build();

		when(requestTypeRepository.findByCode(any())).thenReturn(Optional.of(requestType));
    	when(requestQueryService.existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority))
    		.thenReturn(true);
    	
    	BusinessException be = assertThrows(BusinessException.class, () -> cut.validateAction(competentAuthority, payload));
    	assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.EMP_BATCH_REISSUE_IN_PROGRESS_REQUEST_EXISTS);
    	
    	verify(requestQueryService, times(1)).existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority);
    	verifyNoInteractions(empBatchReissueQueryService);
    }
    
    @Test
    void validateAction_zero_emitters_error() {
    	CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
		RequestType requestType = RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build();

    	EmpBatchReissueRequestCreateActionPayload payload = EmpBatchReissueRequestCreateActionPayload.builder()
				.summary("summary")
    			.build();

		when(requestTypeRepository.findByCode(any())).thenReturn(Optional.of(requestType));
    	when(requestQueryService.existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority))
    		.thenReturn(false);
    	
    	when(empBatchReissueQueryService.existAccountsByCA(competentAuthority))
			.thenReturn(false);
    	
    	BusinessException be = assertThrows(BusinessException.class, () -> cut.validateAction(competentAuthority, payload));
    	assertThat(be.getErrorCode()).isEqualTo(MrtmErrorCode.EMP_BATCH_REISSUE_ZERO_EMITTERS_SELECTED);
    	
    	verify(requestQueryService, times(1)).existByRequestTypeAndRequestStatusAndCompetentAuthority(MrtmRequestType.EMP_BATCH_REISSUE, RequestStatuses.IN_PROGRESS, competentAuthority);
    	verify(empBatchReissueQueryService, times(1)).existAccountsByCA(competentAuthority);
    }
}
