package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.service.AccountRequestSequenceRequestIdGenerator;

import java.util.List;

@Service
public class EmpVariationRequestIdGenerator extends AccountRequestSequenceRequestIdGenerator {

    public EmpVariationRequestIdGenerator(RequestSequenceRepository repository, RequestTypeRepository requestTypeRepository) {
        super(repository, requestTypeRepository);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.EMP_VARIATION);
    }

    @Override
    public String getPrefix() {
        return "MAV";
    }
}