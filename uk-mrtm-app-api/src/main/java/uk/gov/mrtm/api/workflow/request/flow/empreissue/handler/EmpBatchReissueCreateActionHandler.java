package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestCreateActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpBatchReissueRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.domain.EmpReissueAccountDetails;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.mapper.EmpReissueMapper;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueQueryService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestCACreateActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.HashSet;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmpBatchReissueCreateActionHandler implements RequestCACreateActionHandler<EmpBatchReissueRequestCreateActionPayload> {

    private final EmpBatchReissueQueryService empBatchReissueQueryService;
    private final StartProcessRequestService startProcessRequestService;
    private static final EmpReissueMapper EMP_REISSUE_MAPPER = Mappers.getMapper(EmpReissueMapper.class);

    @Override
    public String process(CompetentAuthorityEnum ca, EmpBatchReissueRequestCreateActionPayload payload,
                          AppUser appUser) {
        final Map<Long, EmpReissueAccountDetails> accountsDetails = empBatchReissueQueryService
            .findAccountsByCA(appUser.getCompetentAuthority());

        final RequestParams requestParams = RequestParams.builder()
            .type(MrtmRequestType.EMP_BATCH_REISSUE)
            .requestResources(Map.of(ResourceType.CA, ca.name()))
            .requestPayload(EmpBatchReissueRequestPayload.builder()
                    .payloadType(MrtmRequestPayloadType.EMP_BATCH_REISSUE_REQUEST_PAYLOAD)
                    .summary(payload.getSummary())
                    .signatory(payload.getSignatory())
                    .build())
            .requestMetadata(EmpBatchReissueRequestMetadata.builder()
                    .accountsReports(EMP_REISSUE_MAPPER.toEmpReissueAccountsReports(accountsDetails))
                    .submitterId(appUser.getUserId())
                    .submitter(appUser.getFullName())
                    .type(MrtmRequestMetadataType.EMP_BATCH_REISSUE)
                    .summary(payload.getSummary())
                    .build())
            .processVars(Map.of(BpmnProcessConstants.ACCOUNT_IDS, new HashSet<>(accountsDetails.keySet()),
                    MrtmBpmnProcessConstants.BATCH_NUMBER_OF_ACCOUNTS_COMPLETED, 0))
            .build();

        final Request request = startProcessRequestService.startProcess(requestParams);
        return request.getId();
    }

    @Override
    public String getRequestType() {
        return MrtmRequestType.EMP_BATCH_REISSUE;
    }
}
