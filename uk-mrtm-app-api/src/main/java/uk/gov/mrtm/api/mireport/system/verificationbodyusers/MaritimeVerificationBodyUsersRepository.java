package uk.gov.mrtm.api.mireport.system.verificationbodyusers;

import jakarta.persistence.EntityManager;
import org.hibernate.query.NativeQuery;
import org.hibernate.type.StandardBasicTypes;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class MaritimeVerificationBodyUsersRepository {

    @Transactional(readOnly = true)
    @SuppressWarnings("unchecked")
    public List<MaritimeVerificationBodyUser> findAllVerificationBodyUsers(EntityManager entityManager) {

        return entityManager.createNativeQuery("select verification_body.name as \"verificationBodyName\", verification_body.status as \"accountStatus\", " +
                        " verification_body.accreditation_reference_number as \"accreditationReferenceNumber\", " +
                        " role.name as \"role\", auth.status as \"authorityStatus\", auth.user_id as \"userId\" " +
                        " from verification_body " +
                        " left join au_authority auth on verification_body.id = auth.verification_body_id " +
                        " left join au_role role on auth.code = role.code " +
                        " order by verification_body.status, verification_body.name, role.name ")
                .unwrap(NativeQuery.class)
                .addScalar("verificationBodyName", StandardBasicTypes.STRING)
                .addScalar("accountStatus", StandardBasicTypes.STRING)
                .addScalar("accreditationReferenceNumber", StandardBasicTypes.STRING)
                .addScalar("role", StandardBasicTypes.STRING)
                .addScalar("authorityStatus", StandardBasicTypes.STRING)
                .addScalar("userId", StandardBasicTypes.STRING)
                .setReadOnly(true)
                .setTupleTransformer((tuple, aliases) -> {
                    Map<String, Object> map = new HashMap<>();
                    for(int i = 0; i < tuple.length; i++) {
                        map.put(aliases[i], tuple[i]);
                    }
                    MaritimeVerificationBodyUser result = new MaritimeVerificationBodyUser();
                    result.setVerificationBodyName((String)map.get("verificationBodyName"));
                    result.setAccountStatus((String)map.get("accountStatus"));
                    result.setAccreditationReferenceNumber((String)map.get("accreditationReferenceNumber"));
                    result.setRole((String)map.get("role"));
                    result.setAuthorityStatus((String)map.get("authorityStatus"));
                    result.setUserId((String)map.get("userId"));
                    return result;
                })
                .getResultList();
    }
}
