package uk.gov.mrtm.api.mireport.executedactions;

import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.MiReportGeneratorHandler;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestAction;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsReportGenerator;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MaritimeExecutedRequestActionsReportGeneratorHandler
        extends ExecutedRequestActionsReportGenerator<MaritimeExecutedRequestAction>
        implements MiReportGeneratorHandler<ExecutedRequestActionsMiReportParams> {

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
