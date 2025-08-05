package uk.gov.mrtm.api.account.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MrtmAccountEmpDTO {

    private MrtmAccountViewDTO account;

    private EmpDetailsDTO emp;
}
