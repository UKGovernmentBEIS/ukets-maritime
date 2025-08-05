package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.account.domain.MrtmAccountStatus;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTask;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class MaritimeOutstandingRequestTask extends OutstandingRequestTask {

    @JsonProperty(value = "IMO number")
    private String imoNumber;

    @JsonProperty("Account status")
    private MrtmAccountStatus accountStatus;

    public MaritimeOutstandingRequestTask(String accountId,
                                          String accountName,
                                          String requestId,
                                          String requestType,
                                          String requestTaskType,
                                          String requestTaskAssignee,
                                          LocalDate requestTaskDueDate,
                                          LocalDate requestTaskPausedDate,
                                          String imoNumber,
                                          MrtmAccountStatus accountStatus) {
        super(accountId, accountName, requestId, requestType, requestTaskType, requestTaskAssignee, requestTaskDueDate, requestTaskPausedDate);
        this.imoNumber = imoNumber;
        this.accountStatus = accountStatus;
    }

    public static List<String> getColumnNames() {
        List<String> columnNames = new ArrayList<>(OutstandingRequestTask.getColumnNames());
        columnNames.add("IMO number");
        columnNames.add("Account status");
        return Collections.unmodifiableList(columnNames);
    }
}
