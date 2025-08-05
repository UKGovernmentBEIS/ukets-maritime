package uk.gov.mrtm.api.migration;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.boot.actuate.endpoint.annotation.Selector;
import org.springframework.boot.actuate.endpoint.annotation.WriteOperation;
import org.springframework.boot.actuate.endpoint.web.annotation.WebEndpoint;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
@WebEndpoint(id = "migration")
@RequiredArgsConstructor
public class MigrationEndpoint {

    private final List<MigrationService> migrationServices;

    @WriteOperation
    public List<String> migrate(@Selector String resource, @Selector ExecutionMode mode, @Nullable String csvContents) {

        if(StringUtils.isEmpty(csvContents)) {
            return List.of("Please insert details for at least one account creation");
        }

        MigrationService migrationService = migrationServices.stream()
                .filter(service -> service.getResource().equals(resource))
                .findAny()
                .orElseThrow(() -> new UnsupportedOperationException("resource not supported"));

        return switch (mode) {
            case DRY -> {
                try {
                    migrationService.migrateDryRun(csvContents);
                } catch (DryRunException e) {
                    yield e.getErrors();
                }
                yield Collections.emptyList();
            }
            case COMMIT -> migrationService.migrate(csvContents);
            default -> Collections.emptyList();
        };
    }
}

