package uk.gov.mrtm.api.web.orchestrator.template.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.web.orchestrator.template.dto.DocumentTemplateDTO;
import uk.gov.netz.api.documenttemplate.service.DocumentTemplateQueryService;
import uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateInfoDTO;
import uk.gov.netz.api.notification.template.service.NotificationTemplateQueryService;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DocumentTemplateQueryOrchestratorServiceTest {

	@InjectMocks
    private DocumentTemplateQueryOrchestratorService cut;

    @Mock
    private DocumentTemplateQueryService documentTemplateQueryService;

    @Mock
    private NotificationTemplateQueryService notificationTemplateQueryService;

    @Test
    void getDocumentTemplateDTOById() {
    	Long id = 1L;
    	uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateDTO documentTemplateDTO = uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateDTO.builder()
    			.id(id)
    			.name("documentTemplateName")
    			.notificationTemplateId(2L)
    			.build();
    	
		NotificationTemplateInfoDTO notificationTemplateDTO = new NotificationTemplateInfoDTO(3L,
				"notificationTemplateName", null, "notificationWorkflow", LocalDateTime.now());
		
		when(documentTemplateQueryService.getDocumentTemplateDTOById(id)).thenReturn(documentTemplateDTO);
		when(notificationTemplateQueryService.getNotificationTemplateInfoDTOById(documentTemplateDTO.getNotificationTemplateId()))
				.thenReturn(notificationTemplateDTO);
		
		DocumentTemplateDTO result = cut.getDocumentTemplateDTOById(id);
		
		assertThat(result).isEqualTo(DocumentTemplateDTO.builder()
				.documentTemplate(documentTemplateDTO)
				.notificationTemplates(Set.of(notificationTemplateDTO))
				.build());
		
		verify(documentTemplateQueryService, times(1)).getDocumentTemplateDTOById(id);
		verify(notificationTemplateQueryService, times(1)).getNotificationTemplateInfoDTOById(documentTemplateDTO.getNotificationTemplateId());
    }
}
