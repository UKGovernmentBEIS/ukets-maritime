package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTasksReportService;
import uk.gov.netz.api.workflow.request.application.taskview.RequestTaskViewService;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaritimeOutstandingRequestTasksReportService implements OutstandingRequestTasksReportService {

    private final RequestTaskViewService requestTaskViewService;

    @Override
    @Transactional(readOnly = true)
    public Set<String> getRequestTaskTypesByRoleType(String roleType) {
        return requestTaskViewService.getRequestTaskTypes(roleType).stream()
                .filter(requestTaskType -> !RequestTaskTypeFilter.containsExcludedRequestTaskType(requestTaskType))
                .collect(Collectors.toSet());
    }
}
