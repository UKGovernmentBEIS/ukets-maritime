package uk.gov.mrtm.api.workflow.request.flow.empreissue.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestCreateActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestStatuses;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.core.service.RequestQueryService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.service.RequestCreateByCAValidator;

@RequiredArgsConstructor
@Service
public class RequestCreateEmpBatchReissueValidator implements RequestCreateByCAValidator<EmpBatchReissueRequestCreateActionPayload> {

    private final RequestQueryService requestQueryService;
    private final EmpBatchReissueQueryService empBatchReissueQueryService;
    private final RequestTypeRepository requestTypeRepository;

    @Override
    public RequestCreateValidationResult validateAction(CompetentAuthorityEnum competentAuthority,
                                                        EmpBatchReissueRequestCreateActionPayload payload) {
        final RequestType requestType = requestTypeRepository.findByCode(MrtmRequestType.EMP_BATCH_REISSUE)
                .orElseThrow(() -> new BusinessException(ErrorCode.REQUEST_TYPE_NOT_FOUND));
        final boolean inProgressExist = requestQueryService.existByRequestTypeAndRequestStatusAndCompetentAuthority(
                requestType.getCode(), RequestStatuses.IN_PROGRESS, competentAuthority);
        if(inProgressExist) {
            throw new BusinessException(MrtmErrorCode.EMP_BATCH_REISSUE_IN_PROGRESS_REQUEST_EXISTS);
        }

        if(!empBatchReissueQueryService.existAccountsByCA(competentAuthority)) {
            throw new BusinessException(MrtmErrorCode.EMP_BATCH_REISSUE_ZERO_EMITTERS_SELECTED);
        }
        return null;
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.EMP_BATCH_REISSUE;
    }
}
