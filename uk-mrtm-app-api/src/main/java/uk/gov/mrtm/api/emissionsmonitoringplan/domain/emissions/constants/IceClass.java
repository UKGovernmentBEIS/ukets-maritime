package uk.gov.mrtm.api.emissionsmonitoringplan.domain.emissions.constants;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum IceClass {
    PC1("PC1"),
    PC2("PC2"),
    PC3("PC3"),
    PC4("PC4"),
    PC5("PC5"),
    PC6("PC6"),
    PC7("PC7"),
    IC("IC"),
    IB("IB"),
    IA("IA"),
    IA_SUPER("IA Super"),
    NA("Not applicable");

    private final String description;
}
