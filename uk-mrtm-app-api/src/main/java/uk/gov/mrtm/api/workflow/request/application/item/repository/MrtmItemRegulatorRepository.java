package uk.gov.mrtm.api.workflow.request.application.item.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.account.domain.QMrtmAccount;
import uk.gov.netz.api.account.domain.QAccount;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.application.item.domain.Item;
import uk.gov.netz.api.workflow.request.application.item.repository.ItemRegulatorAbstractRepository;
import uk.gov.netz.api.workflow.request.core.domain.QRequest;
import uk.gov.netz.api.workflow.request.core.domain.QRequestResource;

@Service
@Primary
public class MrtmItemRegulatorRepository extends ItemRegulatorAbstractRepository {

	@Override
	protected void buildSearchTermJoin(JPAQuery<Item> jpaQuery) {
		QRequestResource requestResource2 = new QRequestResource("requestResource2");
		QRequest request = QRequest.request;
		QAccount account = QAccount.account;
		QMrtmAccount mrtmAccount = QMrtmAccount.mrtmAccount;

		jpaQuery.
			innerJoin(requestResource2)
			.on(request.id.eq(requestResource2.request.id).and(requestResource2.resourceType.eq(ResourceType.ACCOUNT)))
			.innerJoin(account)
			.on(account.id.stringValue().eq(requestResource2.resourceId))
			.innerJoin(mrtmAccount)
			.on(account.id.eq(mrtmAccount.id));
	}

	@Override
	protected BooleanExpression buildSearchTermWhereClause(String searchTerm) {
		QAccount account = QAccount.account;
		QMrtmAccount mrtmAccount = QMrtmAccount.mrtmAccount;

		return account.name.containsIgnoreCase(searchTerm)
			.or(account.businessId.eq(searchTerm))
			.or(mrtmAccount.imoNumber.eq(searchTerm));
	}
}
