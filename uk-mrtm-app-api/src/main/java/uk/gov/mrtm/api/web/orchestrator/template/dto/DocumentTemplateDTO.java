package uk.gov.mrtm.api.web.orchestrator.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateInfoDTO;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentTemplateDTO {

	@JsonUnwrapped
    private uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateDTO documentTemplate;
    
    @Builder.Default
    @With
    private Set<NotificationTemplateInfoDTO> notificationTemplates = new HashSet<>();
}
