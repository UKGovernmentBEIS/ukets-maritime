package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueCompletedServiceTest {

	@InjectMocks
	private EmpReissueCompletedService cut;

	@Mock
	private RequestService requestService;
	
	@Mock
	private EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	
	@Mock
	private EmpReissueAddCompletedRequestActionService empReissueAddCompletedRequestActionService;
	
	@Mock
	private EmpReissueOfficialNoticeService empReissueOfficialNoticeService;
	
	@Test
	void reissueCompleted_suceeded() {
		String requestId = "1";
		String batchRequestId = "brId";
		Long accountId = 2L;
		boolean succeeded = true;
		
		EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
			.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
			.accountsReports(Map.of(2L, EmpEmpReissueAccountReport.builder().build()))
		.build();
		
		Request request = Request.builder().id(requestId).build();
		Request batchRequest = Request.builder().metadata(metadata).build();
		
		when(requestService.findRequestById(requestId))
			.thenReturn(request);
		when(requestService.findRequestByIdForUpdate(batchRequestId))
				.thenReturn(batchRequest);
		
		cut.reissueCompleted(requestId, batchRequestId, accountId, succeeded);
		
		verify(requestService, times(1)).findRequestById(requestId);
		verify(requestService, times(1)).findRequestByIdForUpdate(batchRequestId);
		verify(emissionsMonitoringPlanService, times(1)).incrementEmpConsolidationNumber(accountId);
		verify(empReissueOfficialNoticeService, times(1)).sendOfficialNotice(request);
		verify(empReissueAddCompletedRequestActionService, times(1)).add(requestId);
		
		assertThat(metadata.getAccountsReports()).hasSize(1);
		EmpEmpReissueAccountReport report = metadata.getAccountsReports().get(accountId);
		assertThat(report.getIssueDate()).isNotNull();
		assertThat(report.getSucceeded().booleanValue()).isTrue();
		
	}
	
	@Test
	void reissueCompleted_locked_not_suceeded() {
		String requestId = "1";
		String batchRequestId = "brId";
		Long accountId = 2L;
		boolean succeeded = false;
		
		EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
			.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
			.accountsReports(Map.of(2L, EmpEmpReissueAccountReport.builder().build()))
			.build();
		
		Request request = Request.builder().id(requestId).build();
		Request batchRequest = Request.builder().metadata(metadata).build();
		
		when(requestService.findRequestById(requestId))
				.thenReturn(request);
		
		when(requestService.findRequestByIdForUpdate(batchRequestId))
				.thenReturn(batchRequest);
		
		cut.reissueCompleted(requestId, batchRequestId, accountId, succeeded);
		
		verify(requestService, times(1)).findRequestById(requestId);
		verify(requestService, times(1)).findRequestByIdForUpdate(batchRequestId);
		
		assertThat(metadata.getAccountsReports()).hasSize(1);
		EmpEmpReissueAccountReport report = metadata.getAccountsReports().get(accountId);
		assertThat(report.getIssueDate()).isNull();
		assertThat(report.getSucceeded().booleanValue()).isFalse();
		
		verifyNoInteractions(emissionsMonitoringPlanService, empReissueOfficialNoticeService, empReissueAddCompletedRequestActionService);
	}
}
