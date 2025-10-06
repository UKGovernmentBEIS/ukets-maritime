package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpEmpReissueAccountReport;
import uk.gov.netz.api.workflow.bpmn.camunda.CamundaWorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueCompletedServiceTest {

	@InjectMocks
	private EmpReissueCompletedService cut;

	@Mock
	private RequestService requestService;
	
	@Mock
	private CamundaWorkflowService camundaWorkflowService;
	
	@Test
	void reissueCompleted_not_suceeded() {
		String requestId = "1";
		Long accountId = 2L;
		boolean succeeded = false;
		
		EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
			.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
			.accountsReports(Map.of(2L, EmpEmpReissueAccountReport.builder().build()))
			.build();
		
		Request request = Request.builder().metadata(metadata).build();
		
		when(requestService.findRequestById(requestId))
				.thenReturn(request);
		
		cut.reissueCompleted(requestId, accountId, succeeded);
		
		verify(requestService, times(1)).findRequestById(requestId);
		assertThat(metadata.getAccountsReports()).hasSize(1);
		EmpEmpReissueAccountReport report = metadata.getAccountsReports().get(accountId);
		assertThat(report.getIssueDate()).isNull();
		assertThat(report.isSucceeded()).isFalse();
	}
	
	@Test
	void reissueCompleted_suceeded() {
		String requestId = "1";
		Long accountId = 2L;
		boolean succeeded = true;
		
		EmpBatchReissueRequestMetadata metadata = EmpBatchReissueRequestMetadata.builder()
		.type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
		.accountsReports(Map.of(2L, EmpEmpReissueAccountReport.builder().build()))
		.build();
		
		Request request = Request.builder().metadata(metadata).build();
		
		when(requestService.findRequestById(requestId)).thenReturn(request);
		
		cut.reissueCompleted(requestId, accountId, succeeded);
		
		verify(requestService, times(1)).findRequestById(requestId);
		verifyNoMoreInteractions(requestService);
		verifyNoInteractions(camundaWorkflowService);
		assertThat(metadata.getAccountsReports()).hasSize(1);
		EmpEmpReissueAccountReport report = metadata.getAccountsReports().get(accountId);
		assertThat(report.getIssueDate()).isNotNull();
		assertThat(report.isSucceeded()).isTrue();
	}
}
