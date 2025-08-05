package uk.gov.mrtm.api.workflow.request.flow.common.constants;

import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.RequestTypeDocumentTemplateInfoMapper;

/**
 * This class is defined as a bean solely to ensure the static block is executed.
 * It is neither intended to be injected nor used as a static service.
 */
@Component
public class MrtmRequestTypeDocumentTemplateInfoMapper {

    static {
        RequestTypeDocumentTemplateInfoMapper.add(MrtmRequestType.EMP_ISSUANCE, "your application for an Emissions Monitoring Plan");
        RequestTypeDocumentTemplateInfoMapper.add(MrtmRequestType.EMP_VARIATION, "your application for an Emissions Monitoring Plan variation");
        RequestTypeDocumentTemplateInfoMapper.add(MrtmRequestType.EMP_NOTIFICATION, "your Emissions Monitoring Plan notification");
    }
}
