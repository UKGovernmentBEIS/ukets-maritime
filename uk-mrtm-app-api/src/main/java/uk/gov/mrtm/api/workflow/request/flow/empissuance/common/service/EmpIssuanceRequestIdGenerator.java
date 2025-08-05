package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.service.AccountIdBasedRequestIdGenerator;

import java.util.List;

@Service
public class EmpIssuanceRequestIdGenerator extends AccountIdBasedRequestIdGenerator {

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.EMP_ISSUANCE);
    }

    @Override
    public String getPrefix() {
        return "MAMP";
    }
}
