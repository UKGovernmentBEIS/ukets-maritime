package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import uk.gov.mrtm.api.reporting.enumeration.PortCountries;
import uk.gov.mrtm.api.reporting.enumeration.PortType;

public class AerPortCodesUtils {

    public static PortType getJourneyType(PortCountries from, PortCountries to) {
        PortType fromType = from.getType();
        PortType toType = to.getType();

        // INTERNATIONAL
        if ((PortType.INTERNATIONAL == fromType && PortType.GB == toType)
            || (PortType.GB == fromType && PortType.INTERNATIONAL == toType)) {
            return PortType.INTERNATIONAL;
        }

        // EU
        if ((PortType.EU == fromType && PortType.GB == toType)
            || (PortType.GB == fromType && PortType.EU == toType)) {
            return PortType.EU;
        }

        // GB
        if (PortType.GB == fromType && PortType.GB == toType) {
            return PortType.GB;
        }

        return null;
    }
}
