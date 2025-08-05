package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.MiReportGeneratorHandler;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTask;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTasksReportGenerator;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;

@Service
public class MaritimeOutstandingRequestTasksReportGeneratorHandler
        extends OutstandingRequestTasksReportGenerator<MaritimeOutstandingRequestTask>
        implements MiReportGeneratorHandler<OutstandingRegulatorRequestTasksMiReportParams> {

    private final MaritimeOutstandingRequestTasksRepository outstandingRequestTasksRepository;


    public MaritimeOutstandingRequestTasksReportGeneratorHandler(MaritimeOutstandingRequestTasksReportService outstandingRequestTasksReportService, UserInfoApi userInfoApi, MaritimeOutstandingRequestTasksRepository outstandingRequestTasksRepository) {
        super(outstandingRequestTasksReportService, userInfoApi);
        this.outstandingRequestTasksRepository = outstandingRequestTasksRepository;
    }

    @Override
    public List<MaritimeOutstandingRequestTask> findOutstandingRequestTaskParams(EntityManager entityManager, OutstandingRegulatorRequestTasksMiReportParams reportParams) {
        return outstandingRequestTasksRepository.findOutstandingRequestTaskParams(entityManager, reportParams);
    }

    @Override
    public List<String> getColumnNames() {
        return MaritimeOutstandingRequestTask.getColumnNames();
    }

}
