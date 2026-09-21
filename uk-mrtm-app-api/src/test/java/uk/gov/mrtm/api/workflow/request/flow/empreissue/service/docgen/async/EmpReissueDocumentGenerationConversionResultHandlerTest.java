package uk.gov.mrtm.api.workflow.request.flow.empreissue.service.docgen.async;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationContextType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.DocumentGenerationEventOutcome;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.DocumentTemplateGeneratorParamConstants;
import uk.gov.netz.docgenerator.client.model.ConversionEvent;

@ExtendWith(MockitoExtension.class)
class EmpReissueDocumentGenerationConversionResultHandlerTest {

	@InjectMocks
	private EmpReissueDocumentGenerationConversionResultHandler cut;

	@Mock
	private EmpReissueDocumentGenerationCompletedService completedService;
	
	@Mock
	private EmpReissueDocumentGenerationFailedService failedService;

	@Mock
	private ConversionEvent event;

	private Map<String, String> metadata;

	@BeforeEach
	void setUp() {
		metadata = new HashMap<>(Map.of(DocumentTemplateGeneratorParamConstants.CONTEXT_TYPE,
				DocumentGenerationContextType.EMP_REISSUE.name(),
				DocumentTemplateGeneratorParamConstants.REQUEST_ID, "123",
				DocumentTemplateGeneratorParamConstants.FILE_TYPE, RequestGeneratedFileType.EMP.name(),
				DocumentTemplateGeneratorParamConstants.FILE_NAME, "emp.pdf"));
	}

	@Test
	void shouldIgnoreDifferentContextType() {
		metadata.put(DocumentTemplateGeneratorParamConstants.CONTEXT_TYPE, DocumentGenerationContextType.EMP_REVIEW.name());
		
		when(event.getMetadata()).thenReturn(metadata);

		cut.handle(event);

		verifyNoInteractions(completedService, failedService);
	}

	@Test
	void shouldCompleteSuccessfully() {
		when(event.getMetadata()).thenReturn(metadata);
		when(event.getJobId()).thenReturn("job-1");
		when(event.getStatus()).thenReturn(DocumentGenerationEventOutcome.COMPLETE.name());

		cut.handle(event);

		ArgumentCaptor<FileInfoDTO> captor = ArgumentCaptor.forClass(FileInfoDTO.class);

		verify(completedService).completed(eq("123"), eq(RequestGeneratedFileType.EMP),
				eq(DocumentGenerationEventOutcome.COMPLETE.name()), captor.capture());

		FileInfoDTO dto = captor.getValue();

		org.junit.jupiter.api.Assertions.assertEquals("emp.pdf", dto.getName());
		org.junit.jupiter.api.Assertions.assertEquals("job-1", dto.getUuid());
	}

	@Test
	void shouldRetryWhenOptimisticLockExceptionOccurs() {
		when(event.getMetadata()).thenReturn(metadata);
		when(event.getJobId()).thenReturn("job-1");
		when(event.getStatus()).thenReturn(DocumentGenerationEventOutcome.COMPLETE.name());

		doThrow(new ObjectOptimisticLockingFailureException(Object.class, 1L)).when(completedService).completed(any(), any(),
				any(), any());

		assertThrows(ObjectOptimisticLockingFailureException.class, () -> cut.handle(event));

		verify(completedService, times(1)).completed(any(), any(), any(), any());
	}

	@Test
	void shouldReportFailedWhenUnexpectedExceptionOccurs() {
		when(event.getMetadata()).thenReturn(metadata);
		when(event.getJobId()).thenReturn("job-1");
		when(event.getStatus()).thenReturn(DocumentGenerationEventOutcome.COMPLETE.name());

		doThrow(new RuntimeException("boom")).when(completedService).completed(eq("123"), eq(RequestGeneratedFileType.EMP),
				eq(DocumentGenerationEventOutcome.COMPLETE.name()), any());

		cut.handle(event);

		verify(completedService).completed(eq("123"), eq(RequestGeneratedFileType.EMP),
				eq(DocumentGenerationEventOutcome.COMPLETE.name()), eq(FileInfoDTO.builder().name("emp.pdf").uuid("job-1").build()));
		
		verify(failedService).failed(eq("123"), eq(RequestGeneratedFileType.EMP));
	}
}
