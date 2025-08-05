package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueCompletedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueRequestPayload;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestActionUserInfoResolver;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpReissueAddCompletedRequestActionServiceTest {

	@InjectMocks
	private EmpReissueAddCompletedRequestActionService cut;

	@Mock
	private RequestService requestService;
	
	@Mock
	private RequestActionUserInfoResolver requestActionUserInfoResolver;

	@Test
	void add() {
		// Arrange
		String requestId = "1";
		String signatory = "signatoryUuid";
		FileInfoDTO officialNotice = FileInfoDTO.builder()
				.name("off").uuid(UUID.randomUUID().toString())
				.build();
		FileInfoDTO permitDocument = FileInfoDTO.builder()
				.name("permitDocument").uuid(UUID.randomUUID().toString())
				.build();
		EmpReissueRequestPayload requestPayload = EmpReissueRequestPayload.builder()
				.payloadType(MrtmRequestPayloadType.EMP_REISSUE_REQUEST_PAYLOAD)
				.officialNotice(officialNotice)
				.document(permitDocument)
				.build();
		EmpReissueRequestMetadata metadata = EmpReissueRequestMetadata.builder()
				.submitter("submitter")
				.submitterId("submitterId")
				.signatory(signatory)
				.batchRequestId("batchRequestId")
				.build();
		Request request = Request.builder()
				.type(RequestType.builder().code(MrtmRequestType.EMP_REISSUE).build())
				.payload(requestPayload)
				.metadata(metadata)
				.build();

		when(requestService.findRequestById(requestId)).thenReturn(request);
		when(requestActionUserInfoResolver.getUserFullName(signatory)).thenReturn("signatoryFullname");

		// Act
		cut.add(requestId);

		// Capture arguments passed to addActionToRequest
		ArgumentCaptor<EmpReissueCompletedRequestActionPayload> captor = ArgumentCaptor.forClass(EmpReissueCompletedRequestActionPayload.class);

		verify(requestService, times(1)).addActionToRequest(
				eq(request),
				captor.capture(),
				eq(MrtmRequestActionType.EMP_REISSUE_COMPLETED),
				eq("submitterId")
		);

		// Assert
		EmpReissueCompletedRequestActionPayload capturedPayload = captor.getValue();
		assertThat(capturedPayload.getSubmitter()).isEqualTo("submitter");
		assertThat(capturedPayload.getSignatory()).isEqualTo("signatoryUuid");
		assertThat(capturedPayload.getSignatoryName()).isEqualTo("signatoryFullname");
		assertThat(capturedPayload.getOfficialNotice()).isEqualTo(officialNotice);
		assertThat(capturedPayload.getDocument()).isEqualTo(permitDocument);
	}
	
}
