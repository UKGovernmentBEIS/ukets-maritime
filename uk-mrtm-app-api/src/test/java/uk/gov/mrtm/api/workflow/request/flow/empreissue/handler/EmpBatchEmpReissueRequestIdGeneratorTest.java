package uk.gov.mrtm.api.workflow.request.flow.empreissue.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.mrtm.api.workflow.request.flow.empreissue.service.EmpBatchReissueRequestIdGenerator;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.competentauthority.CompetentAuthorityEnum;
import uk.gov.netz.api.workflow.request.core.domain.RequestSequence;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmpBatchEmpReissueRequestIdGeneratorTest {

    @InjectMocks
    private EmpBatchReissueRequestIdGenerator generator;

    @Mock
    private RequestSequenceRepository requestSequenceRepository;

    @Mock
    private RequestTypeRepository requestTypeRepository; // Ensure this is mocked

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(MrtmRequestType.EMP_BATCH_REISSUE);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("BRMA");
    }

    @Test
    void generate() {

        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        long currentSequence = 153;

        RequestParams params = RequestParams.builder()
                .requestResources(Map.of(ResourceType.CA, competentAuthority.name()))
                .type(MrtmRequestType.EMP_BATCH_REISSUE)
                .build();

        RequestType requestType = RequestType.builder().code(MrtmRequestType.EMP_BATCH_REISSUE).build();

        RequestSequence requestSequence = RequestSequence.builder()
                                        .id(2L)
                                        .businessIdentifier(competentAuthority.name())
                                        .sequence(currentSequence)
                                        .requestType(requestType)
                                        .build();

        when(requestTypeRepository.findByCode(MrtmRequestType.EMP_BATCH_REISSUE)).thenReturn(Optional.of(requestType));
        when(requestSequenceRepository.findByBusinessIdentifierAndRequestType(competentAuthority.name(), requestType))
                .thenReturn(Optional.of(requestSequence));

        //invoke
        String result = generator.generate(params);

        assertThat(result).isEqualTo("BRMA0154-E");
        verify(requestSequenceRepository, times(1)).findByBusinessIdentifierAndRequestType(competentAuthority.name(), requestType);
        ArgumentCaptor<RequestSequence> requestSequenceCaptor = ArgumentCaptor.forClass(RequestSequence.class);
        verify(requestSequenceRepository, times(1)).save(requestSequenceCaptor.capture());
        RequestSequence requestSequenceCaptured = requestSequenceCaptor.getValue();
        assertThat(requestSequenceCaptured.getSequence()).isEqualTo(currentSequence + 1);
    }

    @Test
    void generate_new() {
        CompetentAuthorityEnum competentAuthority = CompetentAuthorityEnum.ENGLAND;
        RequestParams params = RequestParams.builder()
                .requestResources(Map.of(ResourceType.CA, competentAuthority.name()))
                .type(MrtmRequestType.EMP_BATCH_REISSUE)
                .build();

        when(requestSequenceRepository.findByBusinessIdentifierAndRequestType(
                competentAuthority.name(),
                RequestType.builder().resourceType(MrtmRequestType.EMP_BATCH_REISSUE).build()))
                .thenReturn(Optional.empty());

        // Optional setup if `findByCode` is used
        when(requestTypeRepository.findByCode(MrtmRequestType.EMP_BATCH_REISSUE))
                .thenReturn(Optional.of(RequestType.builder().resourceType(MrtmRequestType.EMP_BATCH_REISSUE).build()));

        // Invoke the method
        String result = generator.generate(params);

        // Verify results
        assertThat(result).isEqualTo("BRMA0001-E");
        verify(requestSequenceRepository, times(1))
                .findByBusinessIdentifierAndRequestType(
                        competentAuthority.name(),
                        RequestType.builder().resourceType(MrtmRequestType.EMP_BATCH_REISSUE).build());

        ArgumentCaptor<RequestSequence> requestSequenceCaptor = ArgumentCaptor.forClass(RequestSequence.class);
        verify(requestSequenceRepository, times(1)).save(requestSequenceCaptor.capture());
        RequestSequence requestSequenceCaptured = requestSequenceCaptor.getValue();
        assertThat(requestSequenceCaptured.getSequence()).isEqualTo(1);
    }
}
