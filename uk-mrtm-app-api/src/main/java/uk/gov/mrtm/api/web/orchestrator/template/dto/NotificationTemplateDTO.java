package uk.gov.mrtm.api.web.orchestrator.template.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.With;
import uk.gov.netz.api.documenttemplate.domain.dto.DocumentTemplateInfoDTO;

import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonUnwrapped;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationTemplateDTO {

	@JsonUnwrapped
    private uk.gov.netz.api.notification.template.domain.dto.NotificationTemplateDTO notificationTemplate;
    
    @Builder.Default
    @With
    private Set<DocumentTemplateInfoDTO> documentTemplates = new HashSet<>();

}
