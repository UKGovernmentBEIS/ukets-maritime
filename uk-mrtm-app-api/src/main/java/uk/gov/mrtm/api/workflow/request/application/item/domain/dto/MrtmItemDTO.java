package uk.gov.mrtm.api.workflow.request.application.item.domain.dto;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.application.item.domain.dto.ItemDTO;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@SuperBuilder
public class MrtmItemDTO extends ItemDTO {
    @JsonUnwrapped
    private ItemAccountDTO account;
}
