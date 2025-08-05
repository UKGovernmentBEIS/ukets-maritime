package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import lombok.experimental.UtilityClass;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;

import java.util.HashSet;
import java.util.Set;

@UtilityClass
public class RequestTaskTypeFilter {

    public boolean containsExcludedRequestTaskType(String requestTaskType) {
        Set<String> excludedRequestTaskTypes = new HashSet<>(MrtmRequestTaskType.getWaitForRequestTaskTypes());
        excludedRequestTaskTypes.addAll(MrtmRequestTaskType.getTrackPaymentTypes());
        return excludedRequestTaskTypes.contains(requestTaskType);
    }
}
