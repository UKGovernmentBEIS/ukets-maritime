package uk.gov.mrtm.api.web.orchestrator.template.service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AllArgsConstructor;
import uk.gov.netz.api.documenttemplate.service.DocumentTemplateQueryService;
import uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateInfoDTO;
import uk.gov.netz.api.notification.template.service.NotificationTemplateQueryService;
import uk.gov.mrtm.api.web.orchestrator.template.dto.DocumentTemplateDTO;

@Service
@AllArgsConstructor
public class DocumentTemplateQueryOrchestratorService {

	private final DocumentTemplateQueryService documentTemplateQueryService;
	private final NotificationTemplateQueryService notificationTemplateQueryService;
	
	@Transactional(readOnly = true)
    public DocumentTemplateDTO getDocumentTemplateDTOById(Long id) {
		final uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateDTO documentTemplateDTO = documentTemplateQueryService
				.getDocumentTemplateDTOById(id);
		
		final NotificationTemplateInfoDTO notificationTemplate = Optional.ofNullable(documentTemplateDTO.getNotificationTemplateId())
				.map(notificationTemplateQueryService::getNotificationTemplateInfoDTOById)
				.orElse(null);
		
		return DocumentTemplateDTO.builder()
				.documentTemplate(documentTemplateDTO)
				.notificationTemplates(notificationTemplate != null ? Set.of(notificationTemplate): Collections.emptySet())
				.build();
    }
}
