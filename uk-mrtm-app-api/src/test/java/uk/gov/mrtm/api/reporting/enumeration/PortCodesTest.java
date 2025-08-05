package uk.gov.mrtm.api.reporting.enumeration;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNull;


class PortCodesTest {

    @Test
    void testPortCodes1() {
        PortCodes1 portCodes1 = PortCodes1.GRAML;

        assertEquals(PortCodes1.fromString("GRAML"), portCodes1);
        assertNotEquals(PortCodes1.fromString("TEST"), portCodes1);
        assertNull(PortCodes1.fromString("TEST"));
    }

    @Test
    void testPortCodes2() {
        PortCodes2 portCodes2 = PortCodes2.GRAMR;

        assertEquals(PortCodes2.fromString("GRAMR"), portCodes2);
        assertNotEquals(PortCodes2.fromString("TEST"), portCodes2);
        assertNull(PortCodes2.fromString("TEST"));
    }
}