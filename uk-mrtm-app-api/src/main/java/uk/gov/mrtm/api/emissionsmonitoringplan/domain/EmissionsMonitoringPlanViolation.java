package uk.gov.mrtm.api.emissionsmonitoringplan.domain;

import lombok.Data;
import lombok.Getter;

import java.util.List;

@Data
public class EmissionsMonitoringPlanViolation {

    private String sectionName;
    private String message;
    private Object[] data;

    public EmissionsMonitoringPlanViolation(String sectionName, EmissionsMonitoringPlanViolation.ViolationMessage violationMessage) {
        this(sectionName, violationMessage, List.of());
    }

    public EmissionsMonitoringPlanViolation(String sectionName, EmissionsMonitoringPlanViolation.ViolationMessage violationMessage,
                                            Object... data) {
        this.sectionName = sectionName;
        this.message = violationMessage.getMessage();
        this.data = data;
    }

    @Getter
    public enum ViolationMessage {
        DUPLICATE_EMISSIONS_FUEL_NAME("EMP contains multiple fuel records with the same name about the same ship"),
        DUPLICATE_EMISSIONS_SOURCE_NAME("EMP contains multiple emission sources with the same name about the same ship"),
        INVALID_EMISSIONS_SOURCES_POTENTIAL_FUEL_TYPE("Potential fuel types are not derived from fuels and emissions factors"),
        INVALID_EMISSIONS_SOURCES_UNCERTAINTY_METHODS("Uncertainty monitoring methods are not derived from emission sources monitoring methods"),
        INVALID_CARBON_TECHNOLOGIES_NAMES("EMP carbon technologies names are invalid"),
        INVALID_MEASUREMENT_DESCRIPTION_EMISSION_SOURCES("Measurement description emission sources are not derived from emission sources"),
        INVALID_IMO_NUMBER("IMO number does not exist"),
        FUEL_NOT_ASSOCIATED_WITH_EMISSION_SOURCES("EMP fuel type not associated with any emission source"),
        //ADD more emp violation messages
        ;

        private final String message;

        ViolationMessage(String message) {
            this.message = message;
        }
    }
}
