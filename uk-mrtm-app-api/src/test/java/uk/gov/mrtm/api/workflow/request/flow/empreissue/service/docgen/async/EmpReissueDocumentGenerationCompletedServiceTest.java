package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanQueryService;
import uk.gov.mrtm.api.emissionsmonitoringplan.service.EmissionsMonitoringPlanService;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationEventOutcome;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.files.documents.service.storage.FileDocumentStorageService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestResource;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.docgenerator.client.DocumentGeneratorClient;

@ExtendWith(MockitoExtension.class)
class EmpReissueDocumentGenerationCompletedServiceTest {

	@InjectMocks
	private EmpReissueDocumentGenerationCompletedService cut;

	@Mock
	private RequestService requestService;

	@Mock
	private DocumentGeneratorClient documentGeneratorClient;

	@Mock
	private FileDocumentStorageService fileDocumentStorageService;

	@Mock
	private EmissionsMonitoringPlanQueryService emissionsMonitoringPlanQueryService;

	@Mock
	private EmissionsMonitoringPlanService emissionsMonitoringPlanService;
	
	@Mock
	private EmpReissueDocumentGenerationSendCompletedEventService sendEventService;

	@Test
	void completed_emp_not_both_generated() {
		String requestId = "reqId";
		Long accountId = 1L;
		RequestGeneratedFileType fileType = RequestGeneratedFileType.EMP;
		String status = DocumentGenerationEventOutcome.COMPLETE.name();
		FileInfoDTO fileInfoDTO = FileInfoDTO.builder()
				.name("name")
				.uuid("uuid")
				.build();
		
		EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.build();
		Request request = Request.builder()
				.payload(requestPayload)
				.requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId))
						.resourceType(ResourceType.ACCOUNT).build()))
				.build();
		
		byte[] fileBytes = "test".getBytes();
		
		FileInfoDTO fileDocumentDTO = FileInfoDTO.builder()
				.uuid("uuid2")
				.name("name2")
				.build();
		
		EmpDetailsDTO empDetailsDTO = EmpDetailsDTO.builder()
				.id("empId")
				.build();
		
		when(requestService.findRequestByIdForUpdate(requestId)).thenReturn(request);
		when(documentGeneratorClient.downloadBytes(fileInfoDTO.getUuid())).thenReturn(fileBytes);
		when(fileDocumentStorageService.createFileDocumentWithUuid(fileBytes, fileInfoDTO.getName(),
				fileInfoDTO.getUuid())).thenReturn(fileDocumentDTO);
		when(emissionsMonitoringPlanQueryService.getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId))
				.thenReturn(Optional.of(empDetailsDTO));
		
		cut.completed(requestId, fileType, status, fileInfoDTO);

		assertThat(requestPayload.getDocument()).isEqualTo(fileDocumentDTO);
		assertThat(requestPayload.getDocumentSucceed()).isEqualTo(Boolean.TRUE);

		verify(requestService, times(1)).findRequestByIdForUpdate(requestId);
		verify(documentGeneratorClient, times(1)).downloadBytes(fileInfoDTO.getUuid());
		verify(fileDocumentStorageService, times(1)).createFileDocumentWithUuid(fileBytes, fileInfoDTO.getName(),
				fileInfoDTO.getUuid());
		verify(emissionsMonitoringPlanQueryService, times(1)).getEmissionsMonitoringPlanDetailsDTOByAccountId(accountId);
		verify(emissionsMonitoringPlanService, times(1)).setFileDocumentUuid(empDetailsDTO.getId(), fileDocumentDTO.getUuid());
		verify(sendEventService, times(1)).sendEventIfAllDocsCompleted(requestId);
	}
	
	@Test
	void completed_official_notice_both_generated() {
		String requestId = "reqId";
		Long accountId = 1L;
		RequestGeneratedFileType fileType = RequestGeneratedFileType.OFFICIAL_NOTICE;
		String status = DocumentGenerationEventOutcome.COMPLETE.name();
		FileInfoDTO fileInfoDTO = FileInfoDTO.builder()
				.name("name")
				.uuid("uuid")
				.build();
		
		EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.documentSucceed(Boolean.TRUE)
				.document(FileInfoDTO.builder().build())
				.build();
		Request request = Request.builder()
				.payload(requestPayload)
				.requestResources(List.of(RequestResource.builder().resourceId(String.valueOf(accountId))
						.resourceType(ResourceType.ACCOUNT).build()))
				.build();
		
		byte[] fileBytes = "test".getBytes();
		
		FileInfoDTO fileDocumentDTO = FileInfoDTO.builder()
				.uuid("uuid2")
				.name("name2")
				.build();
		
		when(requestService.findRequestByIdForUpdate(requestId)).thenReturn(request);
		when(documentGeneratorClient.downloadBytes(fileInfoDTO.getUuid())).thenReturn(fileBytes);
		when(fileDocumentStorageService.createFileDocumentWithUuid(fileBytes, fileInfoDTO.getName(),
				fileInfoDTO.getUuid())).thenReturn(fileDocumentDTO);
		
		cut.completed(requestId, fileType, status, fileInfoDTO);

		assertThat(requestPayload.getOfficialNotice()).isEqualTo(fileDocumentDTO);
		assertThat(requestPayload.getOfficialNoticeSucceed()).isEqualTo(Boolean.TRUE);

		verify(requestService, times(1)).findRequestByIdForUpdate(requestId);
		verify(documentGeneratorClient, times(1)).downloadBytes(fileInfoDTO.getUuid());
		verify(fileDocumentStorageService, times(1)).createFileDocumentWithUuid(fileBytes, fileInfoDTO.getName(),
				fileInfoDTO.getUuid());
		verify(sendEventService, times(1)).sendEventIfAllDocsCompleted(requestId);
		
		verifyNoInteractions(emissionsMonitoringPlanQueryService);
	}

}
