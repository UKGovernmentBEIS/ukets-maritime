package uk.gov.mrtm.api.web.controller.requestfeedback;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.mrtm.api.workflow.request.feedback.domain.common.MrtmRequestFeedbackType;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackDetailsDTO;
import uk.gov.netz.api.request.feedback.domain.RequestFeedbackPayload;
import uk.gov.netz.api.request.feedback.service.RequestFeedbackService;
import uk.gov.netz.api.security.Authorized;

import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.NO_CONTENT;
import static uk.gov.mrtm.api.web.constants.SwaggerApiInfo.OK;

@RestController
@Validated
@RequiredArgsConstructor
@Tag(name = "Request feedback API")
@RequestMapping(path = "/v1.0/request-feedback")
@ConditionalOnProperty(name = "feature-flag.request.feedback.enabled", havingValue = "true")
public class RequestFeedbackController {

    private final RequestFeedbackService requestFeedbackService;

    @GetMapping
    @Operation(summary = "Get request feedback details")
    @ApiResponse(responseCode = "200", description = OK,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestFeedbackDetailsDTO.class)))
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestId", resourceSubType = "#type")
    public ResponseEntity<RequestFeedbackDetailsDTO> getRequestFeedbackDetails(
        @RequestParam("requestId") @Parameter(name = "requestId", description = "The request ID") @NotNull String requestId,
        @RequestParam("type") @Parameter(name = "type", description = "The request feedback type") @NotNull MrtmRequestFeedbackType type) {
        return ResponseEntity.ok(requestFeedbackService.getRequestFeedbackDetails(requestId, type));
    }

    @PostMapping
    @Operation(summary = "Submit request feedback")
    @ApiResponse(responseCode = "204", description = NO_CONTENT,
        content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestFeedbackDetailsDTO.class)))
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.REQUEST_FEEDBACK_BAD_REQUEST,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "403", description = SwaggerApiInfo.FORBIDDEN,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#requestId", resourceSubType = "#type")
    public ResponseEntity<Void> submitRequestFeedback(
        @Parameter(hidden = true) AppUser user,
        @RequestBody @Valid @Parameter(description = "The request task action body", required = true)
        RequestFeedbackPayload payload,
        @RequestParam("requestId") @Parameter(name = "requestId", description = "The request ID") @NotNull String requestId,
        @RequestParam("type") @Parameter(name = "type", description = "The request feedback type") @NotNull MrtmRequestFeedbackType type) {

        requestFeedbackService.submitRequestFeedback(requestId, type, payload, user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
