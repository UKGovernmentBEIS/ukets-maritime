package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.service.AccountRequestSequenceRequestIdGenerator;

import java.util.List;

@Service
public class EmpNotificationRequestIdGenerator extends AccountRequestSequenceRequestIdGenerator {

    public EmpNotificationRequestIdGenerator(RequestSequenceRepository repository, RequestTypeRepository requestTypeRepository) {
        super(repository, requestTypeRepository);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.EMP_NOTIFICATION);
    }

    @Override
    public String getPrefix() {
        return "MAN";
    }
}
