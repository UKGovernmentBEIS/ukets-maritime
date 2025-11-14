package uk.gov.mrtm.api.workflow.request.flow.aer.common.utils;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.reporting.domain.ports.AerPortVisit;
import uk.gov.mrtm.api.reporting.enumeration.PortType;

@UtilityClass
public class AerPortCodesUtils {

    public static PortType getJourneyType(AerPortVisit from, AerPortVisit to) {
        PortType fromType = from.getCountry().getType(from);
        PortType toType = to.getCountry().getType(to);

        // INTERNATIONAL
        if (PortType.INTERNATIONAL == fromType || PortType.INTERNATIONAL == toType) {
            return PortType.INTERNATIONAL;
        }

        // EU
        if (PortType.EU == fromType || PortType.EU == toType) {
            return PortType.EU;
        }

        // GB
        if ((PortType.GB == fromType && PortType.GB == toType) ||
            (PortType.NI == fromType && PortType.NI == toType)) {
            return PortType.GB;
        }

        if ((PortType.NI == fromType && PortType.GB == toType)
            || (PortType.GB == fromType && PortType.NI == toType)) {
            return PortType.NI;
        }

        return null;
    }
}
