package uk.gov.mrtm.api.web.orchestrator.template.service;

import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateInfoDTO;
import uk.gov.netz.api.documenttemplate.service.DocumentTemplateQueryService;
import uk.gov.netz.api.notification.template.service.NotificationTemplateQueryService;
import uk.gov.mrtm.api.web.orchestrator.template.dto.NotificationTemplateDTO;

@Service
@AllArgsConstructor
public class NotificationTemplateQueryOrchestratorService {
	
	private final NotificationTemplateQueryService notificationTemplateQueryService;
	private final DocumentTemplateQueryService documentTemplateQueryService;

	@Transactional(readOnly = true)
    public NotificationTemplateDTO getManagedNotificationTemplateById(Long id) {
		final uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateDTO notificationTemplateDTO = notificationTemplateQueryService
				.getManagedNotificationTemplateById(id);
		
		final Set<DocumentTemplateInfoDTO> documentTemplates = documentTemplateQueryService.getAllByNotificationTemplateId(id);
		
		return NotificationTemplateDTO.builder()
				.notificationTemplate(notificationTemplateDTO)
				.documentTemplates(documentTemplates)
				.build();
    }
	 
}
