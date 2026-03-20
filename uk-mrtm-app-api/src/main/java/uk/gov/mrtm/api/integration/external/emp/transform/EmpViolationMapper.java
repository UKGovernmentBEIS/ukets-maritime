package uk.gov.mrtm.api.integration.external.emp.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlanViolation;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.common.validation.Violation;

import java.util.Arrays;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface EmpViolationMapper {

    @Mapping(target = "fieldName", source = "empViolation.sectionName")
    @Mapping(target = "message", source = "empViolation")
    Violation toViolation(EmissionsMonitoringPlanViolation empViolation);

    default String map(EmissionsMonitoringPlanViolation empViolation) {
        String message = empViolation.getMessage();

        String dataString = empViolation.getData() != null && empViolation.getData().length > 0
            ? " | ErrorData: " + Arrays.toString(empViolation.getData())
            : "";

        return message + dataString;
    }
}
