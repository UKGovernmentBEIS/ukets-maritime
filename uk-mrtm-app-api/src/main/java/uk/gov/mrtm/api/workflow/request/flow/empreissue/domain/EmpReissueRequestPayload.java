package uk.gov.mrtm.api.workflow.request.flow.empreissue.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public class EmpReissueRequestPayload extends RequestPayload {

    private Integer consolidationNumber;

    private FileInfoDTO officialNotice;

    private FileInfoDTO document; //emp

    private String summary;
}
