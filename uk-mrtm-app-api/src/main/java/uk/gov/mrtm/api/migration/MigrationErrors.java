package uk.gov.mrtm.api.migration;

import lombok.experimental.UtilityClass;


@UtilityClass
public class MigrationErrors {

    //mrtm-accounts
    public static final String MIGRATION_ERROR_INVALID_REGULATOR_USER = "Regulator user not found or exists with a different role in DB";
    public static final String MIGRATION_ERROR_DUPLICATE_IMO_IN_RECORDS = "Duplicate IMO number in CSV";
    public static final String MIGRATION_ERROR_DUPLICATE_IMO_IN_DB = "Account with this IMO number already exists in DB";
    public static final String MIGRATION_ERROR_OPERATOR_FOUND_WITH_DIFFERENT_ROLE_IN_DB = "A user with the same email as the operator provided exists in the system under a different role";
    public static final String MIGRATION_ERROR_INVALID_DATA_IN_ROW = "Invalid or unparsable data in record";

    //operator-admin-users-invite
    public static final String MIGRATION_ERROR_OPERATOR_USER_ALREADY_IN_ACCOUNT = "Operator admin is already a user of an account with this IMO number";
    public static final String MIGRATION_ERROR_ACCOUNT_DOES_NOT_EXIST = "No account was found with the given IMO number";
}
