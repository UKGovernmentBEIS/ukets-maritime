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
}
