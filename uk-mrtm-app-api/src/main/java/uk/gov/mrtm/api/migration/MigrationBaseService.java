package uk.gov.mrtm.api.migration;

import java.util.List;

public abstract class MigrationBaseService implements MigrationService {

    @Override
    public void migrateDryRun(String csvContents) {
        List<String> errorsOccurred = migrate(csvContents);

        // rollback
        throw new DryRunException(errorsOccurred);
    }
}
