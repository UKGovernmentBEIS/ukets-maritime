package uk.gov.mrtm.api.thirdpartydatamanagement.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.thirdpartydatamanagement.common.domain.ThirdPartyDataRequestType;
import uk.gov.mrtm.api.thirdpartydatamanagement.importdata.service.ThirdPartyDataManagementImportHandler;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ThirdPartyDataManagementServiceResolver {
    private final List<ThirdPartyDataManagementImportHandler> importServices;

    public ThirdPartyDataManagementImportHandler resolveImportService(ThirdPartyDataRequestType requestType) {
        return importServices.stream()
            .filter(s -> s.getRequestType().equals(requestType))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Import data service not found for request type: " + requestType));
    }
}