package uk.gov.mrtm.api.mireport.outstandingrequesttasks;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import uk.gov.mrtm.api.account.domain.QMrtmAccount;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.common.PostgresJpqlTemplates;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRegulatorRequestTasksMiReportParams;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTask;
import uk.gov.netz.api.mireport.outstandingrequesttasks.OutstandingRequestTasksRepository;
import uk.gov.netz.api.workflow.request.core.domain.QRequest;
import uk.gov.netz.api.workflow.request.core.domain.QRequestResource;
import uk.gov.netz.api.workflow.request.core.domain.QRequestTask;

import java.util.List;

@Repository
public class MaritimeOutstandingRequestTasksRepository implements OutstandingRequestTasksRepository {

    @Override
    @Transactional(readOnly = true)
    public List<MaritimeOutstandingRequestTask> findOutstandingRequestTaskParams(EntityManager entityManager,
                                                                         OutstandingRegulatorRequestTasksMiReportParams params) {

        QRequest request = QRequest.request;
        QRequestResource requestResource = QRequestResource.requestResource;
        QRequestTask requestTask = QRequestTask.requestTask;
        QMrtmAccount account = QMrtmAccount.mrtmAccount;

        JPAQuery<OutstandingRequestTask> query = new JPAQuery<>(entityManager, PostgresJpqlTemplates.DEFAULT);

        JPAQuery<MaritimeOutstandingRequestTask> jpaQuery = query.select(
                        Projections.constructor(
                                MaritimeOutstandingRequestTask.class,
                                account.businessId,
                                account.name,
                                request.id,
                                request.type.code,
                                requestTask.type.code,
                                requestTask.assignee,
                                requestTask.dueDate,
                                requestTask.pauseDate,
                                account.imoNumber,
                                account.status)
                )
                .from(request)
                .innerJoin(requestTask).on(request.id.eq(requestTask.request.id))
                .innerJoin(requestResource).on(request.id.eq(requestResource.request.id))
                .innerJoin(account).on(requestResource.resourceId.eq(account.id.stringValue()).and(requestResource.resourceType.eq(ResourceType.ACCOUNT)));

        BooleanExpression wherePredicate = requestTask.type.code.in(params.getRequestTaskTypes());

        if (!params.getUserIds().isEmpty()) {
            wherePredicate = wherePredicate.and(requestTask.assignee.in(params.getUserIds()));
        }

        query.where(wherePredicate);
        query.orderBy(account.id.asc(), request.type.code.asc(), request.id.asc(), requestTask.type.code.asc());

        return jpaQuery.fetch();
    }
}
