package uk.gov.mrtm.api.emissionsmonitoringplan.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanEntity;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmissionsMonitoringPlanDTO;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.dto.EmpDetailsDTO;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.files.common.domain.dto.FileInfoDTO;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmissionsMonitoringPlanMapper {

    @Mapping(target = "empAttachments", source = "emissionsMonitoringPlanEntity.empContainer.empAttachments")
    EmpDetailsDTO toEmpDetailsDTO(EmissionsMonitoringPlanEntity emissionsMonitoringPlanEntity, FileInfoDTO fileDocument);

    EmissionsMonitoringPlanDTO toEmissionsMonitoringPlanDTO(EmissionsMonitoringPlanEntity emissionsMonitoringPlanEntity);

}
