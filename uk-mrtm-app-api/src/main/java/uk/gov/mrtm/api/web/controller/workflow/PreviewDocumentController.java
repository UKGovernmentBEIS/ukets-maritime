package uk.gov.mrtm.api.web.controller.workflow;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uk.gov.mrtm.api.web.constants.SwaggerApiInfo;
import uk.gov.mrtm.api.web.controller.exception.ErrorResponse;
import uk.gov.netz.api.files.common.domain.dto.FileDTO;
import uk.gov.netz.api.security.Authorized;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.domain.PreviewDocumentRequest;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.AsyncPreviewDocumentHandlerDelegator;
import uk.gov.netz.api.workflow.request.application.filedocument.preview.service.SyncPreviewDocumentHandlerDelegator;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping(path = "/v1.0/document-preview")
@RequiredArgsConstructor
@Tag(name = "Document Preview")
@SecurityRequirements
public class PreviewDocumentController {

    final SyncPreviewDocumentHandlerDelegator syncDocumentDelegator;
    final AsyncPreviewDocumentHandlerDelegator asyncDocumentDelegator;

    @PostMapping(path = "/{taskId}")
    @Operation(summary = "Get the file for preview")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = Resource.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
            content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#taskId")
    public ResponseEntity<Resource> getDocumentPreview(
        @PathVariable("taskId") @Parameter(description = "The task id") Long taskId,
        @RequestBody @Valid @Parameter(description = "The request to preview the document", required = true)
        PreviewDocumentRequest previewDocumentRequest
    )
    {
        final FileDTO file = syncDocumentDelegator.getDocument(taskId, previewDocumentRequest);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.builder("attachment").filename(file.getFileName(), StandardCharsets.UTF_8).build().toString())
                .contentType(MediaType.parseMediaType(file.getFileType()))
                .body(new ByteArrayResource(file.getFileContent()));
    }

    @PostMapping(path = "/async/{taskId}")
    @Operation(summary = "Trigger the async document generation for preview")
    @ApiResponse(responseCode = "200", description = SwaggerApiInfo.OK, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = RequestTaskPayload.class))})
    @ApiResponse(responseCode = "400", description = SwaggerApiInfo.BAD_REQUEST, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "404", description = SwaggerApiInfo.NOT_FOUND, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "429", description = SwaggerApiInfo.TOO_MANY_REQUESTS,
        content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @ApiResponse(responseCode = "500", description = SwaggerApiInfo.INTERNAL_SERVER_ERROR, content = {@Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = ErrorResponse.class))})
    @Authorized(resourceId = "#taskId")
    public ResponseEntity<RequestTaskPayload> triggerAsyncDocumentGeneration(
        @PathVariable("taskId") @Parameter(description = "The task id") Long taskId,
        @RequestBody @Valid @Parameter(description = "The request to preview the document", required = true)
        PreviewDocumentRequest previewDocumentRequest) {

        return ResponseEntity.ok(asyncDocumentDelegator.triggerDocumentGeneration(taskId, previewDocumentRequest));
    }
}
