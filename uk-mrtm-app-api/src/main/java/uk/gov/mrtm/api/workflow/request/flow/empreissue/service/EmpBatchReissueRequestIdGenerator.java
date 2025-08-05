package uk.gov.mrtm.api.workflow.request.flow.empreissue.service;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.service.CompetentAuthoritySequenceRequestIdGenerator;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;

import java.util.List;

@Service
public class EmpBatchReissueRequestIdGenerator extends CompetentAuthoritySequenceRequestIdGenerator {

    public EmpBatchReissueRequestIdGenerator(RequestSequenceRepository repository, RequestTypeRepository requestTypeRepository) {
        super(repository, requestTypeRepository);
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestType.EMP_BATCH_REISSUE);
    }

    @Override
    public String getPrefix() {
        return "BRMA";
    }
}
