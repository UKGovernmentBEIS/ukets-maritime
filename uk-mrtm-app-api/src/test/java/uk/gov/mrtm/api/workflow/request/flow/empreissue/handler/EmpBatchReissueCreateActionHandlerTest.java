package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestCreateActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestCreateActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.authorization.core.domain.AppAuthority;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpBatchReissueCreateActionHandlerTest {

	@InjectMocks
    private EmpBatchReissueCreateActionHandler cut;
    
    @Mock
    private EmpBatchReissueQueryService empBatchReissueQueryService;
    
    @Mock
    private StartProcessRequestService startProcessRequestService;
    
    @Test
    void getType() {
    	assertThat(cut.getRequestType()).isEqualTo(MrtmRequestType.EMP_BATCH_REISSUE);
    }

	@Captor
	private ArgumentCaptor<RequestParams> requestParamsCaptor;

	@Test
	void process() {
		CompetentAuthorityEnum ca = CompetentAuthorityEnum.ENGLAND;
		EmpBatchReissueRequestCreateActionPayload payload = EmpBatchReissueRequestCreateActionPayload.builder()
				.payloadType(MrtmRequestCreateActionPayloadType.EMP_BATCH_REISSUE_REQUEST_CREATE_ACTION_PAYLOAD)
				.signatory("signatory")
				.build();

		AppUser currentUser = AppUser.builder()
				.userId("userId")
				.firstName("fn").lastName("ln")
				.authorities(List.of(AppAuthority.builder().competentAuthority(ca).build()))
				.build();

		Map<Long, EmpReissueAccountDetails> accountDetails = Map.of(
				1L, EmpReissueAccountDetails.builder().accountName("accountName1").empId("empId1").build(),
				2L, EmpReissueAccountDetails.builder().accountName("accountName2").empId("empId2").build()
		);
		when(empBatchReissueQueryService.findAccountsByCA(ca)).thenReturn(accountDetails);

		when(startProcessRequestService.startProcess(requestParamsCaptor.capture()))
				.thenReturn(Request.builder().id("2").build());

		String result = cut.process(ca, payload, currentUser);

		assertThat(result).isEqualTo("2");
		verify(empBatchReissueQueryService).findAccountsByCA(ca);
		verify(startProcessRequestService).startProcess(requestParamsCaptor.capture());

		RequestParams capturedParams = requestParamsCaptor.getValue();
		assertThat(capturedParams.getRequestResources()).containsExactlyEntriesOf(Map.of(ResourceType.CA, ca.name()));
	}
    
}
