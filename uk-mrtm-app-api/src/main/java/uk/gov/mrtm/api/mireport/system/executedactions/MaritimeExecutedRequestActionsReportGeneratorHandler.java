package uk.gov.mrtm.api.mireport.system.executedactions;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.system.MiReportSystemGenerator;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.system.executedactions.ExecutedRequestActionsReportGenerator;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaritimeExecutedRequestActionsReportGeneratorHandler
        extends ExecutedRequestActionsReportGenerator<MaritimeExecutedRequestAction>
        implements MiReportSystemGenerator<ExecutedRequestActionsMiReportParams> {

    private final MaritimeExecutedRequestActionsRepository executedRequestActionsRepository;

    @Override
    public List<MaritimeExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager,
                                                                  ExecutedRequestActionsMiReportParams reportParams) {
        return executedRequestActionsRepository.findExecutedRequestActions(entityManager, reportParams);
    }

    @Override
    public List<String> getColumnNames() {
        return MaritimeExecutedRequestAction.getColumnNames();
    }
}
