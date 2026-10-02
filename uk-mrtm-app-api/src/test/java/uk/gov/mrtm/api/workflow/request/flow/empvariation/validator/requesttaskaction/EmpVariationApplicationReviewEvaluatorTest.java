package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator.requesttaskaction;

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
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.domain.constants.RequestTaskActionTypes;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileInfoDTO;
import uk.gov.netz.api.workflow.request.core.domain.dto.RequestTaskPreviewFileStatus;

import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class EmpVariationApplicationReviewEvaluatorTest {

    @InjectMocks
    private EmpVariationApplicationReviewEvaluator evaluator;

    @ParameterizedTest
    @MethodSource
    void isEligible(Map<RequestGeneratedFileType, RequestTaskPreviewFileInfoDTO> previewFiles, boolean expected) {
        final boolean actual = evaluator.isEligible(EmpVariationApplicationReviewRequestTaskPayload.builder()
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
        assertEquals(MrtmRequestTaskType.EMP_VARIATION_APPLICATION_REVIEW, evaluator.getRequestTaskType());
    }

    @Test
    void getRequestTaskActionTypes() {
        assertThat(evaluator.getRequestTaskActionTypes()).containsExactly(
            RequestTaskActionTypes.RFI_SUBMIT,
            RequestTaskActionTypes.RFI_UPLOAD_ATTACHMENT,
            RequestTaskActionTypes.RDE_SUBMIT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_APPLICATION_REVIEW,
            MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_SECTION_ATTACHMENT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_REVIEW_GROUP_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_DETAILS_REVIEW_GROUP_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_UPLOAD_REVIEW_GROUP_DECISION_ATTACHMENT,
            MrtmRequestTaskActionType.EMP_VARIATION_SAVE_REVIEW_DETERMINATION,
            MrtmRequestTaskActionType.EMP_VARIATION_NOTIFY_OPERATOR_FOR_DECISION,
            MrtmRequestTaskActionType.EMP_VARIATION_REQUEST_PEER_REVIEW,
            MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_RETURN_FOR_AMENDS,
            MrtmRequestTaskActionType.RFI_SAVE,
            MrtmRequestTaskActionType.RDE_SAVE);
    }
}
