package uk.gov.mrtm.api.workflow.request.flow.registry.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.integration.registry.regulatornotice.domain.MrtmRegulatorNoticeNotificationType;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class RegistryRegulatorNoticeEventSubmittedRequestActionPayload extends RequestActionPayload {

    @NotNull
    private Integer registryId;

    @NotNull
    private MrtmRegulatorNoticeNotificationType type;

    private FileInfoDTO officialNotice;

    @Override
    public Map<UUID, String> getFileDocuments() {
        Map<UUID, String> officialNoticeFileDocuments =
            Map.of(UUID.fromString(officialNotice.getUuid()), officialNotice.getName());

        return Stream.of(super.getFileDocuments(),officialNoticeFileDocuments)
            .flatMap(m -> m.entrySet().stream())
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
