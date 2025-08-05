package uk.gov.mrtm.api.workflow.request.flow.common.constants;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.workflow.request.flow.common.service.notification.RequestTypeDocumentTemplateInfoMapper;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class MrtmRequestTypeDocumentTemplateInfoMapperTest {

    @Test
    void values() {
        new MrtmRequestTypeDocumentTemplateInfoMapper();
        assertThat(RequestTypeDocumentTemplateInfoMapper.getTemplateInfo(MrtmRequestType.EMP_ISSUANCE))
            .isEqualTo("your application for an Emissions Monitoring Plan");
        assertThat(RequestTypeDocumentTemplateInfoMapper.getTemplateInfo(MrtmRequestType.EMP_VARIATION))
            .isEqualTo("your application for an Emissions Monitoring Plan variation");
        assertThat(RequestTypeDocumentTemplateInfoMapper.getTemplateInfo(MrtmRequestType.EMP_NOTIFICATION))
            .isEqualTo("your Emissions Monitoring Plan notification");
    }
}