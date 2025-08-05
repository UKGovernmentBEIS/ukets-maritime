package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpIssuanceReviewDeterminationValidatorServiceTest {


    @InjectMocks
    private EmpIssuanceReviewDeterminationValidatorService reviewDeterminationValidatorService;

    @Spy
    private ArrayList<EmpIssuanceReviewDeterminationTypeValidator> validators;

    @Mock
    private EmpIssuanceReviewDeterminationApprovedValidator reviewDeterminationApprovedValidator;

    @BeforeEach
    void setup() {
        validators.add(reviewDeterminationApprovedValidator);
    }

    @Test
    void isValid() {
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder().build();

        when(reviewDeterminationApprovedValidator.getType()).thenReturn(EmpIssuanceDeterminationType.APPROVED);
        when(reviewDeterminationApprovedValidator.isValid(requestTaskPayload)).thenReturn(true);

        assertTrue(reviewDeterminationValidatorService.isValid(requestTaskPayload, determinationType));

        verify(reviewDeterminationApprovedValidator, times(1)).getType();
        verify(reviewDeterminationApprovedValidator, times(1)).isValid(requestTaskPayload);
        verifyNoMoreInteractions(reviewDeterminationApprovedValidator);
    }

    @Test
    void isValid_when_no_Validator_found_throws_error() {
        EmpIssuanceDeterminationType determinationType = EmpIssuanceDeterminationType.APPROVED;
        EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload =
            EmpIssuanceApplicationReviewRequestTaskPayload.builder().build();

        when(reviewDeterminationApprovedValidator.getType()).thenReturn(EmpIssuanceDeterminationType.DEEMED_WITHDRAWN);

        BusinessException be = assertThrows(BusinessException.class, () -> {
            reviewDeterminationValidatorService.isValid(requestTaskPayload, determinationType);
        });

        assertThat(be.getErrorCode()).isEqualTo(ErrorCode.RESOURCE_NOT_FOUND);

        verify(reviewDeterminationApprovedValidator, times(1)).getType();
        verify(reviewDeterminationApprovedValidator, never()).isValid(any());
        verifyNoMoreInteractions(reviewDeterminationApprovedValidator);
    }

}