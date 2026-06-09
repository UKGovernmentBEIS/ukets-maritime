package uk.gov.mrtm.api.integration.external;

import java.util.LinkedHashSet;

/**
 * Test fixtures for {@link uk.gov.mrtm.api.web.controller.exception.RejectedValueFieldPathResolverTest}.
 * Types must live under {@code uk.gov.mrtm.api.integration.external} so the resolver traverses them.
 */
public final class RejectedValueFieldPathResolverTestFixtures {

    private RejectedValueFieldPathResolverTestFixtures() {
    }

    public enum TestStatus {
        ACTIVE,
        INACTIVE
    }

    public static class TestRoot {
        private LinkedHashSet<TestEntry> entries;

        public LinkedHashSet<TestEntry> getEntries() {
            return entries;
        }

        public void setEntries(LinkedHashSet<TestEntry> entries) {
            this.entries = entries;
        }
    }

    public static class TestEntry {
        private TestStatus status;
        private String marker;

        public TestStatus getStatus() {
            return status;
        }

        public void setStatus(TestStatus status) {
            this.status = status;
        }

        public String getMarker() {
            return marker;
        }

        public void setMarker(String marker) {
            this.marker = marker;
        }
    }
}
