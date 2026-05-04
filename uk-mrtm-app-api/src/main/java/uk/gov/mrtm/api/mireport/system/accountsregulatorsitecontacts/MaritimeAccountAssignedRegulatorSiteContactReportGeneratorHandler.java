package uk.gov.mrtm.api.mireport.system.accountsregulatorsitecontacts;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;
import uk.gov.netz.api.mireport.system.MiReportSystemGenerator;
import uk.gov.netz.api.mireport.system.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactReportGenerator;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;

@Service
public class MaritimeAccountAssignedRegulatorSiteContactReportGeneratorHandler
        extends AccountAssignedRegulatorSiteContactReportGenerator<MaritimeAccountAssignedRegulatorSiteContact>
        implements MiReportSystemGenerator<EmptyMiReportSystemParams> {

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
