package uk.gov.mrtm.api.reporting.enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum PortCodesNorthernIreland {
    GBBEL("Belfast", PortCountries.GB),
    GBCLR("Coleraine", PortCountries.GB),
    GBKLR("Kilroot", PortCountries.GB),
    GBLAR("Larne", PortCountries.GB),
    GBLDY("Londonderry", PortCountries.GB),
    GBWPT("Warrenpoint", PortCountries.GB);

    private final String name;
    private final PortCountries country;

    public static PortCodesNorthernIreland fromString(String value) {
        for (PortCodesNorthernIreland e : PortCodesNorthernIreland.values()) {
            if (e.name().equalsIgnoreCase(value)) {
                return e;
            }
        }
        return null;
    }
}
