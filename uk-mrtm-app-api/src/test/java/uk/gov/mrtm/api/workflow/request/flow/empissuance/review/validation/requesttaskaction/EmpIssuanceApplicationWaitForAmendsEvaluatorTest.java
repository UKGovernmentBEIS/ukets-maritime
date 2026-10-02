package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation.requesttaskaction;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.domain.RequestGeneratedFileType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceApplicationWaitForAmendsEvaluatorTest {

    @InjectMocks
    private EmpIssuanceApplicationWaitForAmendsEvaluator evaluator;

    @ParameterizedTest
    @MethodSource
    void isEligible(Map<RequestGeneratedFileType, RequestTaskPreviewFileInfoDTO> previewFiles, boolean expected) {
        final boolean actual = evaluator.isEligible(EmpIssuanceApplicationReviewRequestTaskPayload.builder()
            .previewFiles(previewFiles)
            .build());

        assertThat(actual).isEqualTo(expected);
    }

    private static Stream<Arguments> isEligible() {
        RequestTaskPreviewFileInfoDTO completedFile = RequestTaskPreviewFileInfoDTO.builder()
            .status(RequestTaskPreviewFileStatus.COMPLETED)
            .build();

        RequestTaskPreviewFileInfoDTO inProgressFile = RequestTaskPreviewFileInfoDTO.builder()
            .status(RequestTaskPreviewFileStatus.IN_PROGRESS)
            .build();

        return Stream.of(
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, inProgressFile, RequestGeneratedFileType.OFFICIAL_NOTICE, completedFile), false),
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, completedFile, RequestGeneratedFileType.OFFICIAL_NOTICE, inProgressFile), false),
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, inProgressFile, RequestGeneratedFileType.OFFICIAL_NOTICE, inProgressFile), false),
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, completedFile, RequestGeneratedFileType.OFFICIAL_NOTICE, completedFile), true),
            Arguments.of(Map.of(RequestGeneratedFileType.OFFICIAL_NOTICE, completedFile), true),
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, completedFile), true),
            Arguments.of(Map.of(RequestGeneratedFileType.OFFICIAL_NOTICE, inProgressFile), false),
            Arguments.of(Map.of(RequestGeneratedFileType.EMP, inProgressFile), false),
            Arguments.of(Map.of(), true)
        );
    }

    @Test
    void getRequestTaskType() {
        assertEquals(MrtmRequestTaskType.EMP_ISSUANCE_WAIT_FOR_AMENDS, evaluator.getRequestTaskType());
    }

    @Test
    void getRequestTaskActionTypes() {
        assertThat(evaluator.getRequestTaskActionTypes()).containsExactly(RequestTaskActionTypes.RFI_SUBMIT,
            RequestTaskActionTypes.RFI_UPLOAD_ATTACHMENT,
            RequestTaskActionTypes.RDE_SUBMIT,
            MrtmRequestTaskActionType.EMP_ISSUANCE_RECALL_FROM_AMENDS,
            MrtmRequestTaskActionType.RFI_SAVE,
            MrtmRequestTaskActionType.RDE_SAVE);
    }
}
