package uk.gov.mrtm.api.mireport.accountsregulatorsitecontacts;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.MiReportGeneratorHandler;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactReportGenerator;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;

@Service
public class MaritimeAccountAssignedRegulatorSiteContactReportGeneratorHandler
        extends AccountAssignedRegulatorSiteContactReportGenerator<MaritimeAccountAssignedRegulatorSiteContact>
        implements MiReportGeneratorHandler<EmptyMiReportParams> {

    private final MaritimeAccountAssignedRegulatorSiteContactsRepository regulatorSiteContactsRepository;

    public MaritimeAccountAssignedRegulatorSiteContactReportGeneratorHandler(
            MaritimeAccountAssignedRegulatorSiteContactsRepository regulatorSiteContactsRepository,
            UserInfoApi userInfoApi) {
        super(userInfoApi);
        this.regulatorSiteContactsRepository = regulatorSiteContactsRepository;
    }

    @Override
    public List<MaritimeAccountAssignedRegulatorSiteContact> findAccountAssignedRegulatorSiteContacts(EntityManager entityManager) {
        return regulatorSiteContactsRepository.findAccountAssignedRegulatorSiteContacts(entityManager);
    }

    @Override
    public List<String> getColumnNames() {
        return MaritimeAccountAssignedRegulatorSiteContact.getColumnNames();
    }
}
