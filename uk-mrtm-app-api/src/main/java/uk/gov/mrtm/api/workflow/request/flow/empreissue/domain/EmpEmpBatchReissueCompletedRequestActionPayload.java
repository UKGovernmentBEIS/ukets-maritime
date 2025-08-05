package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;

import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpEmpBatchReissueCompletedRequestActionPayload extends EmpBatchReissueSubmittedRequestActionPayload {

    @NotNull
    @PositiveOrZero
    private Integer numberOfAccounts;

    private FileInfoDTO report;

    @Override
    public Map<UUID, String> getFileDocuments() {
        return Stream.of(super.getFileDocuments(),
                        Map.of(
                                UUID.fromString(report.getUuid()), report.getName()
                        )
                )
                .flatMap(m -> m.entrySet().stream()).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

}
