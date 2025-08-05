package uk.gov.mrtm.api.reporting.util;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@ExtendWith(MockitoExtension.class)
class AerIdentifierGeneratorTest {

    @Test
    void testGenerate() {

        Long accountId = 12345L;
        int reportingYear = 2025;
        String expected = "MAR12345-2025";

        String result = AerIdentifierGenerator.generate(accountId, reportingYear);

        // Assert
        assertNotNull(result);
        assertEquals(expected, result);
    }
}
