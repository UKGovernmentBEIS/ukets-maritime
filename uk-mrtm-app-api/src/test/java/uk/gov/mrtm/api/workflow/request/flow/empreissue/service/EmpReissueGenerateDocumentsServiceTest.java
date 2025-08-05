package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueGenerateDocumentsServiceTest {

	@InjectMocks
	private EmpReissueGenerateDocumentsService cut;
	
	@Mock
	private EmpReissueCreateEmpDocumentService empReissueCreateEmpDocumentService;
	
	@Mock
	private EmpReissueOfficialNoticeService empReissueOfficialNoticeService;

	@Mock
	private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;
	
	@Mock
	private EmissionsMonitoringPlanService emissionsMonitoringPlanService;

	@Test
	void generateDocuments() {
        final Long accountId = 1L;

        final EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
            .build();

    	final Request request = Request.builder()
        		.type(RequestType.builder().code(MrtmRequestType.EMP_REISSUE).build())
				.requestResources(List.of(RequestResource.builder()
						.resourceId(accountId.toString())
						.resourceType(ResourceType.ACCOUNT)
						.build()))
        		.payload(requestPayload)
        		.build();

    	UUID pdfUuid = UUID.randomUUID();
    	FileInfoDTO empDocument = FileInfoDTO.builder()
    			.name("emp.pdf")
    			.uuid(pdfUuid.toString())
    			.build();

    	UUID officialNoticePdfUuid = UUID.randomUUID();
    	FileInfoDTO officialNotice = FileInfoDTO.builder()
    			.name("offnotice.pdf")
    			.uuid(officialNoticePdfUuid.toString())
    			.build();

    	final EmpDetailsDTO empDetailsDTO = EmpDetailsDTO.builder().id("empId").build();

    	when(empReissueCreateEmpDocumentService.create(request))
    		.thenReturn(CompletableFuture.completedFuture(empDocument));
    	when(empReissueOfficialNoticeService.generateOfficialNotice(request))
    		.thenReturn(CompletableFuture.completedFuture(officialNotice));
    	when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId)).thenReturn(Optional.of(empDetailsDTO));

    	cut.generateDocuments(request);

    	verify(empReissueCreateEmpDocumentService, times(1)).create(request);
    	verify(empReissueOfficialNoticeService, times(1)).generateOfficialNotice(request);
    	verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId);
    	verify(emissionsMonitoringPlanService, times(1)).setFileDocumentUuid(empDetailsDTO.getId(), pdfUuid.toString());

    	assertThat(requestPayload.getDocument()).isEqualTo(empDocument);
    	assertThat(requestPayload.getOfficialNotice()).isEqualTo(officialNotice);
	}
}
