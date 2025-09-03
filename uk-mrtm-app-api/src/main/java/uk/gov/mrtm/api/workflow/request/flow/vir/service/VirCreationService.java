package uk.gov.mrtm.api.workflow.request.flow.vir.service;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestMetadataType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestMetadata;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.mapper.VirMapper;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirCreationValidator;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.workflow.request.StartProcessRequestService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestCreateValidationResult;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VirCreationService {

    private final RequestService requestService;
    private final VirDueDateService virDueDateService;
    private final VirCreationValidator virCreationValidator;
    private final StartProcessRequestService startProcessRequestService;
    
    private static final VirMapper VIR_MAPPER = Mappers.getMapper(VirMapper.class);

    @Transactional
    public Request createRequestVir(final String aerRequestId, Long accountId) {
        
        final Request aerRequest = requestService.findRequestById(aerRequestId);
        final AerRequestPayload aerRequestPayload = (AerRequestPayload) aerRequest.getPayload();
        final AerRequestMetadata aerRequestMetadata = (AerRequestMetadata) aerRequest.getMetadata();

        // Initiate VIR request payload
        final VirRequestPayload virRequestPayload = VirRequestPayload.builder()
                .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                .verificationData(VIR_MAPPER
                        .toVirVerificationData(aerRequestPayload.getVerificationData()))
                .build();

        // Validate if VIR is allowed
        final RequestCreateValidationResult validationResult =
            virCreationValidator.validate(
                virRequestPayload.getVerificationData(),
                aerRequest.getAccountId(),
                aerRequestMetadata.getYear()
            );
        if(!validationResult.isValid()) {
            throw new BusinessException(MrtmErrorCode.VIR_CREATION_NOT_ALLOWED, validationResult);
        }

        // Add Expiration Date
        final Map<String, Object> processVars = new HashMap<>();
        processVars.put(MrtmBpmnProcessConstants.VIR_EXPIRATION_DATE,
                virDueDateService.generateDueDate(aerRequestMetadata.getYear()));

        // Start VIR flow
        final RequestParams params = RequestParams.builder()
                .type(MrtmRequestType.VIR)
                .requestPayload(virRequestPayload)
                .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
                .requestMetadata(VirRequestMetadata.builder()
                        .type(MrtmRequestMetadataType.VIR)
                        .year(aerRequestMetadata.getYear())
                        .relatedAerRequestId(aerRequest.getId())
                        .build())
                .processVars(processVars)
                .build();

        return startProcessRequestService.startProcess(params);
    }
}
