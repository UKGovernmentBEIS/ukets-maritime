package uk.gov.mrtm.api.workflow.request.flow.accountclosure.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.service.AccountRequestSequenceRequestIdGenerator;

import java.util.List;

@Service
public class AccountClosureRequestIdGenerator extends AccountRequestSequenceRequestIdGenerator {

	public AccountClosureRequestIdGenerator(RequestSequenceRepository repository, RequestTypeRepository requestTypeRepository) {
        super(repository, requestTypeRepository);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.ACCOUNT_CLOSURE);
    }

    @Override
    public String getPrefix() {
        return "MAC";
    }
}
