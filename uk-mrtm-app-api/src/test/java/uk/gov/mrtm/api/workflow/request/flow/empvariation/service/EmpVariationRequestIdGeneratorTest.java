package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestType;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.core.domain.RequestSequence;
import uk.gov.netz.api.workflow.request.core.domain.RequestType;
import uk.gov.netz.api.workflow.request.core.repository.RequestSequenceRepository;
import uk.gov.netz.api.workflow.request.core.repository.RequestTypeRepository;
import uk.gov.netz.api.workflow.request.flow.common.domain.dto.RequestParams;

import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationRequestIdGeneratorTest {


    @InjectMocks
    private EmpVariationRequestIdGenerator generator;

    @Mock
    private RequestSequenceRepository requestSequenceRepository;

    @Mock
    private RequestTypeRepository requestTypeRepository;

    @Test
    void getTypes() {
        assertThat(generator.getTypes()).containsExactly(MrtmRequestType.EMP_VARIATION);
    }

    @Test
    void getPrefix() {
        assertThat(generator.getPrefix()).isEqualTo("MAV");
    }

    @Test
    void generate() {
        Long accountId = 100L;
        long currentSequence = 100;
        RequestType requestType = RequestType.builder().code(MrtmRequestType.EMP_VARIATION).build();

        RequestParams params = RequestParams.builder()
            .requestResources(Map.of(ResourceType.ACCOUNT, accountId.toString()))
            .type(MrtmRequestType.EMP_VARIATION)
            .build();

        RequestSequence requestSequence = RequestSequence.builder()
            .id(2L)
            .businessIdentifier(String.valueOf(accountId))
            .sequence(currentSequence)
            .requestType(requestType)
            .build();

        when(requestSequenceRepository.findByBusinessIdentifierAndRequestType(String.valueOf(accountId), requestType))
            .thenReturn(Optional.of(requestSequence));
        when(requestTypeRepository.findByCode(MrtmRequestType.EMP_VARIATION)).thenReturn(Optional.of(requestType));

        String result = generator.generate(params);

        assertThat(result).isEqualTo("MAV" + "00100" + "-" + (currentSequence + 1));

        ArgumentCaptor<RequestSequence> requestSequenceCaptor = ArgumentCaptor.forClass(RequestSequence.class);
        verify(requestSequenceRepository).save(requestSequenceCaptor.capture());
        assertThat(requestSequenceCaptor.getValue().getSequence()).isEqualTo(currentSequence + 1);

        verify(requestTypeRepository).findByCode(MrtmRequestType.EMP_VARIATION);
        verify(requestSequenceRepository)
            .findByBusinessIdentifierAndRequestType(String.valueOf(accountId), requestType);
        verifyNoMoreInteractions(requestSequenceRepository, requestTypeRepository);
    }
}