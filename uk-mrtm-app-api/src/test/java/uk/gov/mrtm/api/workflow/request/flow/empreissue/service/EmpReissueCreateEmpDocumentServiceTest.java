package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.account.domain.MrtmAccount;
import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.common.domain.AddressState;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.abbreviations.EmpAbbreviations;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.common.service.MrtmDocumentTemplateAccountDataCollectFromAccountService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRequestQueryService;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueCreateEmpDocumentServiceTest {

	@InjectMocks
	private EmpReissueCreateEmpDocumentService cut;

	@Mock
	private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	
	@Mock
	private EmpCreateDocumentService empCreateDocumentService;
	
	@Mock
	private EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	
	@Mock
	private EmpVariationRequestQueryService empVariationRequestQueryService;

	@Mock
	private DateService dateService;
	
	@Mock
	private MrtmDocumentTemplateAccountDataCollectFromAccountService mrtmAccountTemplateDataCollectFromAccountService;

	@Test
	void create() throws InterruptedException, ExecutionException {
		Long accountId = 1L;
		int nextConsolidationNumber = 2;
		LocalDateTime now = LocalDateTime.now();
		String empId = "empId";

		EmpReissueRequestMetadata metadata = EmpReissueRequestMetadata.builder()
			.signatory("signatory")
			.empConsolidationNumber(nextConsolidationNumber)
			.build();
		
		MrtmAccount account = MrtmAccount.builder()
				.name("accname")
				.imoNumber("123")
				.address(AddressState.builder().city("city").build())
				.build();
		

		Request request = Request.builder()
				.requestResources(List.of(
						RequestResource.builder().resourceId(accountId.toString()).resourceType(ResourceType.ACCOUNT)
								.build(),
						RequestResource.builder().resourceId("ENGLAND").resourceType(ResourceType.CA).build()))
				.metadata(metadata)
				.submissionDate(now)
				.build();
		
		EmissionsMonitoringPlanContainer empContainer = EmissionsMonitoringPlanContainer.builder()
				.emissionsMonitoringPlan(EmissionsMonitoringPlan.builder()
						.abbreviations(EmpAbbreviations.builder().exist(true).build())
						.build())
				.build();

		EmissionsMonitoringPlanDTO emp = EmissionsMonitoringPlanDTO.builder()
				.id(empId)
				.accountId(accountId)
				.empContainer(empContainer)
				.consolidationNumber(nextConsolidationNumber)
				.build();

		List<EmpVariationRequestInfo> variationHistory = List.of(
				EmpVariationRequestInfo.builder()
						.submissionDate(now.minusDays(1))
						.endDate(now).build());
		List<EmpVariationRequestInfo> variationHistoryWithCurrent = List.of(
			EmpVariationRequestInfo.builder()
				.submissionDate(now.minusDays(1))
				.endDate(now).build(),
			EmpVariationRequestInfo.builder()
				.submissionDate(now)
				.endDate(now).metadata(EmpVariationRequestMetadata.builder().empConsolidationNumber(nextConsolidationNumber).build()).build());

		LocalDateTime empEndDate = now.plusDays(1);
		
		String address = "address";
		
		MrtmDocumentTemplateAccountData accountData = MrtmDocumentTemplateAccountData.builder()
				.name(account.getName())
				.competentAuthority(request.getCompetentAuthority())
				.imoNumber(account.getImoNumber())
				.address(address)
				.build();
		
		String jobId = "jobId";
		
		Request empIssuanceRequest = Request.builder().submissionDate(now).endDate(empEndDate).build();
		
		when(dateService.getLocalDateTime()).thenReturn(now);
		when(emissionsMonitoringPlanService.calculateNextConsolidationNumber(accountId)).thenReturn(nextConsolidationNumber);
		when(empVariationRequestQueryService.findEmpVariationRequests(accountId)).thenReturn(variationHistory);
		when(emissionsMonitoringPlanQueryService.getEmpIdByAccountId(accountId)).thenReturn(Optional.of(empId));
		when(emissionsMonitoringPlanQueryService.getEmpContainerById(empId)).thenReturn(empContainer);
		when(emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId))
			.thenReturn(empIssuanceRequest);
		when(mrtmAccountTemplateDataCollectFromAccountService.collect(accountId)).thenReturn(accountData);
		
		
		when(empCreateDocumentService.generateDocumentAsyncConvert(request, null, metadata.getSignatory(), emp,
				MrtmDocumentTemplateType.EMP, DocumentTemplateStage.FINAL, variationHistoryWithCurrent, now, empEndDate,
				accountData, DocumentGenerationContextType.EMP_REISSUE)).thenReturn(jobId);

		String result = cut.create(request);
		assertThat(result).isEqualTo(jobId);

		verify(emissionsMonitoringPlanService, times(1)).calculateNextConsolidationNumber(accountId);
		verify(empVariationRequestQueryService, times(1)).findEmpVariationRequests(accountId);
		verify(emissionsMonitoringPlanQueryService, times(1)).getEmpIdByAccountId(accountId);
		verify(emissionsMonitoringPlanQueryService, times(1)).getEmpContainerById(empId);
		verify(emissionsMonitoringPlanQueryService).findApprovedByAccountId(accountId);
		verify(mrtmAccountTemplateDataCollectFromAccountService, times(1)).collect(accountId);
		
		verify(empCreateDocumentService, times(1)).generateDocumentAsyncConvert(request, null, metadata.getSignatory(),
				emp, MrtmDocumentTemplateType.EMP, DocumentTemplateStage.FINAL, variationHistoryWithCurrent,
				empIssuanceRequest.getSubmissionDate(), empIssuanceRequest.getEndDate(), accountData,
				DocumentGenerationContextType.EMP_REISSUE);
		
	}
}
