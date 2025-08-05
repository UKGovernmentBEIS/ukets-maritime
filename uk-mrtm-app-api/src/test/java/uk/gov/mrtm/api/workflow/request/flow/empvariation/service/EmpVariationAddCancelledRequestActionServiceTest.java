package uk.gov.mrtm.api.workflow.request.flow.empvariation.service;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationRequestPayload;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.service.RequestService;

import java.util.stream.Stream;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationAddCancelledRequestActionServiceTest {

    @InjectMocks
    private EmpVariationAddCancelledRequestActionService service;

    @Mock
    private RequestService requestService;

    @ParameterizedTest
    @MethodSource("testCases")
    void add(String operatorAssignee, String regulatorAssignee, String assignee, String userRole) {

        final Request request = Request.builder()
            .id("1")
            .payload(EmpVariationRequestPayload.builder()
                .operatorAssignee(operatorAssignee)
                .regulatorAssignee(regulatorAssignee)
                .build()
            )
            .build();

        when(requestService.findRequestById("1")).thenReturn(request);

        service.add("1", userRole);

        verify(requestService, times(1)).addActionToRequest(request,
            null,
            MrtmRequestActionType.EMP_VARIATION_APPLICATION_CANCELLED,
            assignee);
    }

    public static Stream<Arguments> testCases() {
        return Stream.of(
            Arguments.of("operator", null, "operator", RoleTypeConstants.OPERATOR),
            Arguments.of(null, "regulator", "regulator", RoleTypeConstants.REGULATOR)
        );
    }
}