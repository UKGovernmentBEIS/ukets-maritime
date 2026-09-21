package uk.gov.mrtm.api.workflow.request.flow.common.service.docgen.async;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

import java.util.Map;
import java.util.stream.Stream;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.documenttemplate.domain.DocumentTemplateStage;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

@ExtendWith(MockitoExtension.class)
class DocumentGenerationConversionFailedServiceTest {

	@InjectMocks
    private DocumentGenerationConversionFailedService cut;

    @Mock
    private RequestTaskService requestTaskService;

	@Mock
	private DocumentGenerationFailedNotificationService failedNotificationService;

	@Test
    void failed_preview() {
    	Long requestTaskId = 1l;
    	RequestGeneratedFileType type = RequestGeneratedFileType.EMP;
    	DocumentTemplateStage stage = DocumentTemplateStage.PREVIEW;

    	EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
    			.previewFiles(Map.of(
    					RequestGeneratedFileType.EMP, RequestTaskPreviewFileInfoDTO.builder().status(RequestTaskPreviewFileStatus.IN_PROGRESS).build()
    					))
    			.build();
    	RequestTask requestTask = RequestTask.builder()
    			.payload(requestTaskPayload)
    			.build();
		when(requestTaskService.findTaskByIdForUpdate(requestTaskId))
				.thenReturn(requestTask);

		cut.failed(requestTaskId, type, stage);

		assertThat(requestTaskPayload.getPreviewFiles().get(RequestGeneratedFileType.EMP).getStatus())
				.isEqualTo(RequestTaskPreviewFileStatus.FAILED);
    	verify(requestTaskService, times(1)).findTaskByIdForUpdate(requestTaskId);
		verifyNoMoreInteractions(requestTaskService);
		verifyNoInteractions(failedNotificationService);
    }

    @ParameterizedTest
	@MethodSource
    void failed_final(boolean isFailureNotificationSent, boolean isSuccessNotificationSent, int sendMailInvocations) {
    	Long requestTaskId = 1l;
    	RequestGeneratedFileType type = RequestGeneratedFileType.EMP;
    	DocumentTemplateStage stage = DocumentTemplateStage.FINAL;

    	EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload = EmpVariationApplicationReviewRequestTaskPayload.builder()
			.failureNotificationSent(isFailureNotificationSent)
			.build();
    	RequestTask requestTask = RequestTask.builder()
    			.payload(requestTaskPayload)
    			.build();
		when(requestTaskService.findTaskByIdForUpdate(requestTaskId))
				.thenReturn(requestTask);

		cut.failed(requestTaskId, type, stage);

		assertThat(requestTaskPayload.getFinalDocumentsGenerationInProgress()).isFalse();
		assertThat(requestTaskPayload.getFinalDocumentsGenerationSuccessful()).isFalse();
		assertThat(requestTaskPayload.getFailureNotificationSent()).isEqualTo(isSuccessNotificationSent);
		verify(requestTaskService, times(1)).findTaskByIdForUpdate(requestTaskId);
		verify(failedNotificationService, times(sendMailInvocations)).notifyRegulator(requestTask);
		verifyNoMoreInteractions(requestTaskService, failedNotificationService);
    }

	public static Stream<Arguments> failed_final() {
		return Stream.of(
			Arguments.of(false, true, 1),
			Arguments.of(true, true, 0)
		);
	}
}
