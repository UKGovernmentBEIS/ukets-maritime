package uk.gov.mrtm.api.workflow.request.flow.doe.common.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.Doe;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.domain.DoeApplicationSubmitRequestTaskPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class DoeMapperTest {

    private final DoeMapper mapper = Mappers.getMapper(DoeMapper.class);


    @Test
    void toDreApplicationSubmitRequestTaskPayload() {
        Doe doe = Doe.builder()
                .build();

        UUID attachment1 = UUID.randomUUID();
        Map<UUID, String> attachments = new HashMap<>();
        attachments.put(attachment1, "att1");

        Map<String, String> sectionsCompleted = Map.of("section", "COMPLETED");

        DoeRequestPayload requestPayload = DoeRequestPayload.builder()
                .doe(doe)
                .doeAttachments(attachments)
                .sectionsCompleted(sectionsCompleted)
                .payloadType(MrtmRequestPayloadType.DOE_REQUEST_PAYLOAD)
                .build();

        DoeApplicationSubmitRequestTaskPayload
                result = mapper.toDoeApplicationSubmitRequestTaskPayload(requestPayload,
                MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD);

        assertThat(result.getPayloadType()).isEqualTo(MrtmRequestTaskPayloadType.DOE_APPLICATION_SUBMIT_PAYLOAD);
        assertThat(result.getDoeAttachments()).containsExactlyEntriesOf(attachments);
        assertThat(result.getDoe()).isEqualTo(doe);
        assertThat(result.getSectionsCompleted()).isEqualTo(sectionsCompleted);
    }
}
