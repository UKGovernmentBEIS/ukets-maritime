package uk.gov.mrtm.api.mireport.system.accountuserscontacts;

import jakarta.persistence.EntityManager;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.netz.api.mireport.system.accountuserscontacts.AccountUsersContactsRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaritimeAccountUsersContactsRepository implements AccountUsersContactsRepository {

    @Override
    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MaritimeAccountUserContact> findAccountUserContacts(EntityManager entityManager) {
        return entityManager.createNativeQuery("""
                select auth.user_id as "userId",
                       role.name as "role",
                       account.business_id as "accountId",
                       account.name as "accountName",
                       acc_mrtm.status as "accountStatus",
                       auth.status as "authorityStatus",
                       acc_mrtm.imo_number as "imoNumber",
                       case when acPrimary.user_id is not null then true else false end as "primaryContact",
                       case when acService.user_id is not null then true else false end as "serviceContact",
                       case when acFinancial.user_id is not null then true else false end as "financialContact",
                       case when acSecondary.user_id is not null then true else false end as "secondaryContact",
                       emp.id as "permitId"
                from account
                         inner join account_mrtm acc_mrtm on account.id = acc_mrtm.id
                         left join emp on account.id = emp.account_id
                         left join au_authority auth on account.id = auth.account_id
                         left join au_role role on auth.code = role.code
                         left join account_contact acPrimary
                                   on account.id = acPrimary.account_id
                                   and auth.user_id = acPrimary.user_id
                                   and acPrimary.contact_type = 'PRIMARY'
                         left join account_contact acService
                                   on account.id = acService.account_id
                                   and auth.user_id = acService.user_id
                                   and acService.contact_type = 'SERVICE'
                         left join account_contact acFinancial
                                   on account.id = acFinancial.account_id
                                   and auth.user_id = acFinancial.user_id
                                   and acFinancial.contact_type = 'FINANCIAL'
                         left join account_contact acSecondary
                                   on account.id = acSecondary.account_id
                                   and auth.user_id = acSecondary.user_id
                                   and acSecondary.contact_type = 'SECONDARY'
                """)
                .unwrap(NativeQuery.class)
                .addScalar("userId", StandardBasicTypes.STRING)
                .addScalar("accountId", StandardBasicTypes.STRING)
                .addScalar("accountName", StandardBasicTypes.STRING)
                .addScalar("accountStatus", StandardBasicTypes.STRING)
                .addScalar("authorityStatus", StandardBasicTypes.STRING)
                .addScalar("primaryContact", StandardBasicTypes.BOOLEAN)
                .addScalar("secondaryContact", StandardBasicTypes.BOOLEAN)
                .addScalar("financialContact", StandardBasicTypes.BOOLEAN)
                .addScalar("serviceContact", StandardBasicTypes.BOOLEAN)
                .addScalar("permitId", StandardBasicTypes.STRING)
                .addScalar("role", StandardBasicTypes.STRING)
                .addScalar("imoNumber", StandardBasicTypes.STRING)
                .setReadOnly(true)
                .setTupleTransformer((tuple, aliases) -> {
                    Map<String, Object> map = new HashMap<>();
                    for(int i = 0; i < tuple.length; i++) {
                        map.put(aliases[i], tuple[i]);
                    }
                    MaritimeAccountUserContact result = new MaritimeAccountUserContact();
                    result.setUserId((String)map.get("userId"));
                    result.setAccountId((String)map.get("accountId"));
                    result.setAccountName((String)map.get("accountName"));
                    result.setAccountStatus((String)map.get("accountStatus"));
                    result.setAuthorityStatus((String)map.get("authorityStatus"));
                    result.setPrimaryContact((Boolean) map.get("primaryContact"));
                    result.setSecondaryContact((Boolean)map.get("secondaryContact"));
                    result.setFinancialContact((Boolean)map.get("financialContact"));
                    result.setServiceContact((Boolean)map.get("serviceContact"));
                    result.setPermitId((String)map.get("permitId"));
                    result.setRole((String)map.get("role"));
                    result.setImoNumber((String)map.get("imoNumber"));
                    return result;
                })
                .getResultList();
    }
}
