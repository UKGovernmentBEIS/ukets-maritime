package uk.gov.mrtm.api.integration.external.aer.transform;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerViolation;
import uk.gov.netz.api.common.config.MapperConfig;
import uk.gov.netz.api.common.validation.Violation;

import java.util.Arrays;

@Mapper(componentModel = "spring", config = MapperConfig.class)
public interface AerViolationMapper {

    @Mapping(target = "fieldName", source = "aerViolation.sectionName")
    @Mapping(target = "message", source = "aerViolation")
    Violation toViolation(AerViolation aerViolation);

    default String map(AerViolation aerViolation) {
        String message = aerViolation.getMessage();

        String dataString = aerViolation.getData() != null && aerViolation.getData().length > 0
            ? " | ErrorData: " + Arrays.toString(aerViolation.getData())
            : "";

        return message + dataString;
    }
}
