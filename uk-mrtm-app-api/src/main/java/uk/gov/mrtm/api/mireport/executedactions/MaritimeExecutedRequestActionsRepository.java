package uk.gov.mrtm.api.mireport.executedactions;

import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import uk.gov.mrtm.api.account.domain.QMrtmAccount;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.QEmissionsMonitoringPlanEntity;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestAction;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsMiReportParams;
import uk.gov.netz.api.mireport.executedactions.ExecutedRequestActionsRepository;
import uk.gov.netz.api.workflow.request.core.domain.QRequest;
import uk.gov.netz.api.workflow.request.core.domain.QRequestAction;
import uk.gov.netz.api.workflow.request.core.domain.QRequestResource;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public class MaritimeExecutedRequestActionsRepository implements ExecutedRequestActionsRepository {
    public List<MaritimeExecutedRequestAction> findExecutedRequestActions(EntityManager entityManager, ExecutedRequestActionsMiReportParams reportParams) {
        QRequest request = QRequest.request;
        QRequestResource requestResource = QRequestResource.requestResource;
        QRequestAction requestAction = QRequestAction.requestAction;
        QMrtmAccount account = QMrtmAccount.mrtmAccount;
        QEmissionsMonitoringPlanEntity emissionsMonitoringPlan = QEmissionsMonitoringPlanEntity.emissionsMonitoringPlanEntity;

        JPAQuery<ExecutedRequestAction> query = new JPAQuery<>(entityManager);

        BooleanBuilder isCreationDateBeforeToDate = new BooleanBuilder();
        if(reportParams.getToDate() != null){
            isCreationDateBeforeToDate.and(requestAction.creationDate.loe(LocalDateTime.of(reportParams.getToDate(), LocalTime.MAX)));
        }

        JPAQuery<MaritimeExecutedRequestAction> jpaQuery = query.select(
                        Projections.constructor(MaritimeExecutedRequestAction.class,
                                account.businessId, account.name, account.status.stringValue(),
                                request.id, request.type.code, request.status,
                                requestAction.type, requestAction.submitter, requestAction.creationDate,
                                account.imoNumber, emissionsMonitoringPlan.id))
                .from(request)
                .innerJoin(requestAction).on(request.id.eq(requestAction.request.id))
                .innerJoin(requestResource).on(request.id.eq(requestResource.request.id))
                .innerJoin(account).on(requestResource.resourceId.eq(account.id.stringValue()).and(requestResource.resourceType.eq(ResourceType.ACCOUNT)))
                .leftJoin(emissionsMonitoringPlan).on(account.id.eq(emissionsMonitoringPlan.accountId))
                .where(requestAction.creationDate.goe(LocalDateTime.of(reportParams.getFromDate(), LocalTime.MIDNIGHT))
                        .and(isCreationDateBeforeToDate))
                .orderBy(account.id.asc(),request.type.code.asc(), request.id.asc(), requestAction.creationDate.asc());

        return jpaQuery.fetch();
    }
}
