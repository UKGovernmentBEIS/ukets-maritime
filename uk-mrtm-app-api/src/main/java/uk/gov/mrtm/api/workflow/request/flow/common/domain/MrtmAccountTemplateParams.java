package uk.gov.mrtm.api.workflow.request.flow.common.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.documenttemplate.domain.templateparams.AccountTemplateParams;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@SuperBuilder
public class MrtmAccountTemplateParams extends AccountTemplateParams {

    private String imoNumber;

    private String serviceContactFirstName;
}
