package uk.gov.mrtm.api.mireport.system.accountuserscontacts;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.system.EmptyMiReportSystemParams;
import uk.gov.netz.api.mireport.system.MiReportSystemGenerator;
import uk.gov.netz.api.mireport.system.accountuserscontacts.AccountUsersContactsReportGenerator;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;

@Service
public class MaritimeAccountUsersContactsReportGeneratorHandler
        extends AccountUsersContactsReportGenerator<MaritimeAccountUserContact>
        implements MiReportSystemGenerator<EmptyMiReportSystemParams> {

    private final MaritimeAccountUsersContactsRepository accountUsersContactsRepository;


    public MaritimeAccountUsersContactsReportGeneratorHandler(MaritimeAccountUsersContactsRepository accountUsersContactsRepository,
                                                              UserInfoApi userInfoApi) {
        super(userInfoApi);
        this.accountUsersContactsRepository = accountUsersContactsRepository;

    }

    @Override
    public List<MaritimeAccountUserContact> findAccountUserContacts(EntityManager entityManager) {
        return accountUsersContactsRepository.findAccountUserContacts(entityManager);
    }

    @Override
    public List<String> getColumnNames() {
        return MaritimeAccountUserContact.getColumnNames();
    }
}
