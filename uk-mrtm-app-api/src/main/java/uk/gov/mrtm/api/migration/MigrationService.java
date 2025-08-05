package uk.gov.mrtm.api.migration;

import java.util.List;

public interface MigrationService {

    void migrateDryRun(String csvContents);

    List<String> migrate(String csvContents);

    String getResource();
}
