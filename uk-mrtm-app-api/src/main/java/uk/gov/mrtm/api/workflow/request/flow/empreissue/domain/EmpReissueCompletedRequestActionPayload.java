package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpReissueCompletedRequestActionPayload extends RequestActionPayload {

    @NotBlank
    private String submitter; //full name

    @NotBlank
    private String signatory;

    @NotBlank
    private String signatoryName; //full name

    @NotNull
    private FileInfoDTO officialNotice;

    @NotNull
    private FileInfoDTO document; //emp

    @NotBlank
    @Size(max = 10000)
    private String summary;

    @Override
    public Map<UUID, String> getFileDocuments() {
        return Stream.of(super.getFileDocuments(),
                        Map.of(
                                UUID.fromString(officialNotice.getUuid()), officialNotice.getName(),
                                UUID.fromString(document.getUuid()), document.getName()
                        )
                )
                .flatMap(m -> m.entrySet().stream()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

}
