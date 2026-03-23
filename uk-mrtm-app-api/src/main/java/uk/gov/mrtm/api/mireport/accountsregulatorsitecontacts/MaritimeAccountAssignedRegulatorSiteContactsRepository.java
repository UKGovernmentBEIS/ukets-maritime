package uk.gov.mrtm.api.mireport.accountsregulatorsitecontacts;

import jakarta.persistence.EntityManager;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContact;
import uk.gov.netz.api.mireport.accountsregulatorsitecontacts.AccountAssignedRegulatorSiteContactsRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaritimeAccountAssignedRegulatorSiteContactsRepository implements AccountAssignedRegulatorSiteContactsRepository {
    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MaritimeAccountAssignedRegulatorSiteContact> findAccountAssignedRegulatorSiteContacts(EntityManager entityManager) {
        return entityManager.createNativeQuery("select account.business_id as \"accountId\", " +
                        " account.name as \"accountName\", acc_mrtm.status as \"accountStatus\"," +
                        " auth.status as \"authorityStatus\", acc_contact.user_id as \"userId\", acc_mrtm.imo_number as \"imoNumber\" " +
                        " from account " +
                        " inner join account_mrtm acc_mrtm on account.id = acc_mrtm.id " +
                        " left join account_contact acc_contact on account.id = acc_contact.account_id and acc_contact.contact_type='CA_SITE' " +
                        " left join au_authority auth on acc_contact.user_id = auth.user_id " +
                        " order by acc_contact.user_id, acc_mrtm.status, account.name asc")
                .unwrap(NativeQuery.class)
                .addScalar("accountId", StandardBasicTypes.STRING)
                .addScalar("accountName", StandardBasicTypes.STRING)
                .addScalar("accountStatus", StandardBasicTypes.STRING)
                .addScalar("authorityStatus", StandardBasicTypes.STRING)
                .addScalar("userId", StandardBasicTypes.STRING)
                .addScalar("imoNumber", StandardBasicTypes.STRING)
                .setReadOnly(true)
                .setTupleTransformer((tuple, aliases) -> {
                    Map<String, Object> map = new HashMap<>();
                    for(int i = 0; i < tuple.length; i++) {
                        map.put(aliases[i], tuple[i]);
                    }
                    MaritimeAccountAssignedRegulatorSiteContact result = new MaritimeAccountAssignedRegulatorSiteContact();
                    result.setAccountId((String)map.get("accountId"));
                    result.setAccountName((String)map.get("accountName"));
                    result.setAccountStatus((String)map.get("accountStatus"));
                    result.setAuthorityStatus((String)map.get("authorityStatus"));
                    result.setUserId((String)map.get("userId"));
                    result.setImoNumber((String)map.get("imoNumber"));
                    return result;
                })
                .getResultList();
    }
}
