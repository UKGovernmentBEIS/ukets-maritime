package uk.gov.mrtm.api.integration.external.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.integration.external.common.domain.ThirdPartyDataProviderStagingDetailsDTO;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ThirdPartyProviderViewServiceDelegator {

    private final List<ThirdPartyProviderService> thirdPartyProviderServices;
    private final RequestTaskService requestTaskService;

    @Transactional(readOnly = true)
    public ThirdPartyDataProviderStagingDetailsDTO getThirdPartyDataProviderInfo(Long requestTaskId) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        Long accountId = requestTask.getRequest().getAccountId();
        String requestTaskCode = requestTask.getType().getCode();

        return getService(requestTaskCode).getThirdPartyDataProviderInfo(accountId, requestTask.getPayload());
    }

    private ThirdPartyProviderService getService(String requestTaskCode) {
        return thirdPartyProviderServices.stream()
            .filter(service -> service.getTypes().contains(requestTaskCode))
            .findFirst()
            .orElseThrow(() -> new UnsupportedOperationException(
                String.format("Third party data for request task type %s is not supported", requestTaskCode)));
    }

}
