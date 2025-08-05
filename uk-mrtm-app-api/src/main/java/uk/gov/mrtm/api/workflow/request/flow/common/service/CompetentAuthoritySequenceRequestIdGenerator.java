package uk.gov.mrtm.api.workflow.request.flow.common.service;

import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.RequestSequence;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestSequenceRequestIdGenerator;

// TODO maybe move to NETZ
public abstract class CompetentAuthoritySequenceRequestIdGenerator extends RequestSequenceRequestIdGenerator {

    private static final String REQUEST_ID_FORMATTER = "%s%04d-%s";
    private final RequestTypeRepository requestTypeRepository;

    protected CompetentAuthoritySequenceRequestIdGenerator(RequestSequenceRepository repository, RequestTypeRepository requestTypeRepository) {
        super(repository);
        this.requestTypeRepository = requestTypeRepository;
    }

    @Override
    protected RequestSequence resolveRequestSequence(RequestParams params) {
        final CompetentAuthorityEnum competentAuthority = params.getCompetentAuthority();
        final RequestType requestType = requestTypeRepository.findByCode(params.getType())
                .orElseThrow(() -> new BusinessException(ErrorCode.REQUEST_TYPE_NOT_FOUND));

        return repository.findByBusinessIdentifierAndRequestType(competentAuthority.name(), requestType)
                .orElse(new RequestSequence(competentAuthority.name(), requestType));
    }

    @Override
    protected String generateRequestId(Long sequenceNo, RequestParams params) {
        return String.format(REQUEST_ID_FORMATTER, getPrefix(), sequenceNo,
                params.getCompetentAuthority().getOneLetterCode());
    }
}
