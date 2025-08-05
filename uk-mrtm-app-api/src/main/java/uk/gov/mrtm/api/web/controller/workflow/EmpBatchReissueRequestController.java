package uk.gov.mrtm.api.web.controller.workflow;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.mrtm.api.web.orchestrator.workflow.dto.EmpBatchReissuesResponseDTO;
import uk.gov.mrtm.api.web.orchestrator.workflow.service.EmpBatchReissueRequestsAndInitiatePermissionOrchestrator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.constants.RoleTypeConstants;
import uk.gov.netz.api.common.domain.PagingRequest;
import uk.gov.netz.api.security.AuthorizedRole;

@Validated
@RestController
@RequestMapping(path = "/v1.0/batch-reissue-requests")
@Tag(name = "Requests")
@RequiredArgsConstructor
public class EmpBatchReissueRequestController {

    private final EmpBatchReissueRequestsAndInitiatePermissionOrchestrator orchestrator;

    @GetMapping
    @Operation(summary = "Get the batch reissue requests")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = EmpBatchReissuesResponseDTO.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @AuthorizedRole(roleType = {RoleTypeConstants.REGULATOR})
    public ResponseEntity<EmpBatchReissuesResponseDTO> getBatchReissueRequests(
            @Parameter(hidden = true) AppUser appUser,
            @RequestParam(value = "page") @NotNull @Parameter(name="page", description = "The page number starting from zero") @Min(value = 0, message = "{parameter.page.typeMismatch}") Integer page,
            @RequestParam(value = "size") @NotNull @Parameter(name="size", description = "The page size") @Min(value = 1, message = "{parameter.pageSize.typeMismatch}")  Integer pageSize
    ) {
        return new ResponseEntity<>(orchestrator.findBatchReissueRequests(appUser,
                PagingRequest.builder().pageNumber(page).pageSize(pageSize).build()), HttpStatus.OK);
    }
}
