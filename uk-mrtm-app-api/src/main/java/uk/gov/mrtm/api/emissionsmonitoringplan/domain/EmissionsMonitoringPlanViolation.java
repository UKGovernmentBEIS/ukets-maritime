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
        INVALID_REGISTERED_OWNER_IMO_NUMBER("Registered owner IMO number already exists"),
        INVALID_REGISTERED_OWNER_SHIP("Registered owner ship does not exist in the list of ships"),
        DUPLICATE_SHIP_IMO_ACROSS_REGISTERED_OWNERS("Duplicate imo ship number found across registered owners"),
        INVALID_REGISTERED_OWNER_SHIP_NAME("Registered owner ship name does not match the name in the list of ships."),
        SHIP_NOT_ASSOCIATED_WITH_REGISTERED_OWNER("Ship not associated with any registered owner."),
        //ADD more emp violation messages
        ;

        private final String message;

        ViolationMessage(String message) {
            this.message = message;
        }
    }
}
