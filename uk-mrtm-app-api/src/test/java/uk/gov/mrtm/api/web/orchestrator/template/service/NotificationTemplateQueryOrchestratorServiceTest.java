package uk.gov.mrtm.api.web.orchestrator.template.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.web.orchestrator.template.dto.NotificationTemplateDTO;
import uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateInfoDTO;
import uk.gov.netz.api.documenttemplate.service.DocumentTemplateQueryService;
import uk.gov.netz.api.notification.template.service.NotificationTemplateQueryService;

import java.time.LocalDateTime;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NotificationTemplateQueryOrchestratorServiceTest {

	@InjectMocks
    private NotificationTemplateQueryOrchestratorService cut;

    @Mock
    private NotificationTemplateQueryService notificationTemplateQueryService;

    @Mock
    private DocumentTemplateQueryService documentTemplateQueryService;

    @Test
    void getManagedNotificationTemplateById() {
    	Long id = 1L;
    	uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateDTO notificationTemplateDTO = uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateDTO.builder()
    			.id(id)
    			.name("documentTemplateName")
    			.build();
    	
    	DocumentTemplateInfoDTO documentTemplateInfoDTO = new DocumentTemplateInfoDTO(2L,
				"notificationTemplateName", null, "documentWorkflow", LocalDateTime.now());
		
		when(notificationTemplateQueryService.getManagedNotificationTemplateById(id)).thenReturn(notificationTemplateDTO);
		when(documentTemplateQueryService.getAllByNotificationTemplateId(id))
				.thenReturn(Set.of(documentTemplateInfoDTO));
		
		NotificationTemplateDTO result = cut.getManagedNotificationTemplateById(id);
		
		assertThat(result).isEqualTo(NotificationTemplateDTO.builder()
				.notificationTemplate(notificationTemplateDTO)
				.documentTemplates(Set.of(documentTemplateInfoDTO))
				.build());
		
		verify(notificationTemplateQueryService, times(1)).getManagedNotificationTemplateById(id);
		verify(documentTemplateQueryService, times(1)).getAllByNotificationTemplateId(id);
    }
}
