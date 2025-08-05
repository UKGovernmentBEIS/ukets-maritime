package uk.gov.mrtm.api.mireport.executedactions;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestAction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MaritimeExecutedRequestAction extends ExecutedRequestAction {

    @JsonProperty(value = "IMO number")
    private String imoNumber;

    @JsonProperty(value = "EMP ID")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String empId;

    public MaritimeExecutedRequestAction(final String accountId,
                                         final String accountName,
                                         final String accountStatus,
                                         final  String requestId,
                                         final String requestType,
                                         final String requestStatus,
                                         final String requestActionType,
                                         final String requestActionSubmitter,
                                         final LocalDateTime requestActionCompletionDate,
                                         final String imoNumber,
                                         final String empId) {
        super(accountId, accountName, accountStatus, requestId, requestType, requestStatus, requestActionType, requestActionSubmitter, requestActionCompletionDate);
        this.imoNumber = imoNumber;
        this.empId = empId;
    }

    public static List<String> getColumnNames() {
        List<String> columnNames = new ArrayList<>(ExecutedRequestAction.getColumnNames());
        columnNames.add("IMO number");
        columnNames.add("EMP ID");
        return Collections.unmodifiableList(columnNames);
    }
}
