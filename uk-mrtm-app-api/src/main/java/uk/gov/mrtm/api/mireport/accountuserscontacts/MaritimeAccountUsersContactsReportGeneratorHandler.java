package uk.gov.mrtm.api.mireport.accountuserscontacts;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import uk.gov.netz.api.mireport.MiReportGeneratorHandler;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountUserContact;
import uk.gov.netz.api.mireport.accountuserscontacts.AccountUsersContactsReportGenerator;
import uk.gov.netz.api.mireport.domain.EmptyMiReportParams;
import uk.gov.netz.api.userinfoapi.UserInfoApi;

import java.util.List;

@Service
public class MaritimeAccountUsersContactsReportGeneratorHandler
        extends AccountUsersContactsReportGenerator<MaritimeAccountUserContact>
        implements MiReportGeneratorHandler<EmptyMiReportParams> {

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
