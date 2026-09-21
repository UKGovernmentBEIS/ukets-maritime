package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import uk.gov.mrtm.api.account.domain.dto.MrtmDocumentTemplateAccountData;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanContainer;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDocumentTemplateType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.EmpCreateDocumentService;
import uk.gov.mrtm.api.workflow.request.flow.common.service.MrtmDocumentTemplateAccountDataCollectFromAccountService;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper.EmpReissueRequestMapper;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestInfo;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.service.EmpVariationRequestQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.common.utils.DateService;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.workflow.request.core.domain.Request;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
class EmpReissueCreateEmpDocumentService {
	
	private final EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	private final EmpCreateDocumentService empCreateDocumentService;
	private final EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	private final EmpVariationRequestQueryService empVariationRequestQueryService;
	private final DateService dateService;
	private final MrtmDocumentTemplateAccountDataCollectFromAccountService mrtmAccountTemplateDataCollectFromAccountService;

	private final EmpReissueRequestMapper empReissueRequestMapper = Mappers.getMapper(EmpReissueRequestMapper.class);

	@Transactional
    public String create(Request request) {
		final EmpReissueRequestMetadata requestMetadata = (EmpReissueRequestMetadata) request.getMetadata();
		final Long accountId = request.getAccountId();
		
		final int nextConsolidationNumber = emissionsMonitoringPlanService
				.calculateNextConsolidationNumber(accountId);
		
		final List<EmpVariationRequestInfo> variationHistoricalRequests =
			empVariationRequestQueryService.findEmpVariationRequests(accountId);
		final EmpVariationRequestInfo variationCurrentRequest = empReissueRequestMapper
			.toEmpVariationRequestInfo(request, dateService.getLocalDateTime());

		List<EmpVariationRequestInfo> variationHistory = new ArrayList<>(variationHistoricalRequests);
		variationHistory.add(variationCurrentRequest);
		
		final String empId = emissionsMonitoringPlanQueryService.getEmpIdByAccountId(accountId)
				.orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND));
		
		final EmissionsMonitoringPlanContainer empContainer = emissionsMonitoringPlanQueryService.getEmpContainerById(empId);
        
        final EmissionsMonitoringPlanDTO emp = EmissionsMonitoringPlanDTO.builder()
        		.id(empId)
        		.accountId(accountId)
        		.empContainer(empContainer)
        		.consolidationNumber(nextConsolidationNumber)
        		.build();

		Request empIssuanceRequest = emissionsMonitoringPlanQueryService.findApprovedByAccountId(accountId);
		
		MrtmDocumentTemplateAccountData accountData = mrtmAccountTemplateDataCollectFromAccountService.collect(accountId);

		 return empCreateDocumentService.generateDocumentAsyncConvert(request,
		        	null,
		        	requestMetadata.getSignatory(),
		        	emp,
		            MrtmDocumentTemplateType.EMP,
		            DocumentTemplateStage.FINAL,
		            variationHistory,
		            empIssuanceRequest.getSubmissionDate(),
		            empIssuanceRequest.getEndDate(),
		            accountData,
		            DocumentGenerationContextType.EMP_REISSUE
		            );
    }
	
}
