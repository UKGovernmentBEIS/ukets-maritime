package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.netz.api.files.attachments.service.FileAttachmentService;

import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
class EmpNotificationAttachmentsValidator {
    
    private final FileAttachmentService fileAttachmentService;
    
    public boolean attachmentsExist(final Set<UUID> sectionAttachments) {
        Set<UUID> nonNullFiles =  sectionAttachments.stream().filter(Objects::nonNull).collect(Collectors.toSet());

        return nonNullFiles.isEmpty() || fileAttachmentService
                .fileAttachmentsExist(nonNullFiles.stream().map(UUID::toString).collect(Collectors.toSet()));
    }
    
    public boolean sectionAttachmentsReferencedInEmpNotification(final Set<UUID> sectionAttachments,
                                                                 final Set<UUID> empNotificationAttachments) {
        return empNotificationAttachments.containsAll(sectionAttachments);
    }

}
