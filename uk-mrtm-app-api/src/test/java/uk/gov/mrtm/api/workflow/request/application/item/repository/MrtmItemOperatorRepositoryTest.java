package uk.gov.mrtm.api.workflow.request.application.item.repository;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQuery;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.account.domain.QMrtmAccount;
import uk.gov.netz.api.account.domain.QAccount;
import uk.gov.netz.api.authorization.rules.domain.ResourceType;
import uk.gov.netz.api.workflow.request.application.item.domain.Item;
import uk.gov.netz.api.workflow.request.core.domain.QRequestResource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MrtmItemOperatorRepositoryTest {

    @InjectMocks
    private MrtmItemOperatorRepository repository;

    @Test
    void buildSearchTermJoin() {
        QRequestResource requestResource = QRequestResource.requestResource;
        QAccount account = QAccount.account;
        QMrtmAccount mrtmAccount = QMrtmAccount.mrtmAccount;

        BooleanExpression accountOn = account.id.stringValue().eq(requestResource.resourceId)
            .and(requestResource.resourceType.eq(ResourceType.ACCOUNT));
        BooleanExpression mrtmAccountOn = account.id.eq(mrtmAccount.id);

        JPAQuery<Item> jpaQuery = mock(JPAQuery.class);
        JPAQuery<Item> afterAccountJoin = mock(JPAQuery.class);
        JPAQuery<Item> afterAccountOn = mock(JPAQuery.class);
        JPAQuery<Item> afterMrtmAccountJoin = mock(JPAQuery.class);
        JPAQuery<Item> afterMrtmAccountOn = mock(JPAQuery.class);

        when(jpaQuery.innerJoin(account)).thenReturn(afterAccountJoin);
        when(afterAccountJoin.on(accountOn)).thenReturn(afterAccountOn);
        when(afterAccountOn.innerJoin(mrtmAccount)).thenReturn(afterMrtmAccountJoin);
        when(afterMrtmAccountJoin.on(mrtmAccountOn)).thenReturn(afterMrtmAccountOn);

        repository.buildSearchTermJoin(jpaQuery);

        verify(jpaQuery).innerJoin(account);
        verify(afterAccountJoin).on(accountOn);
        verify(afterAccountOn).innerJoin(mrtmAccount);
        verify(afterMrtmAccountJoin).on(mrtmAccountOn);
        verifyNoMoreInteractions(jpaQuery, afterAccountJoin, afterAccountOn, afterMrtmAccountJoin, afterMrtmAccountOn);
    }

    @Test
    void buildSearchTermWhereClause() {
        String searchTerm = "ABC123";
        QAccount account = QAccount.account;
        QMrtmAccount mrtmAccount = QMrtmAccount.mrtmAccount;

        BooleanExpression result = repository.buildSearchTermWhereClause(searchTerm);

        assertThat(result).isEqualTo(
            account.name.containsIgnoreCase(searchTerm)
                .or(account.businessId.eq(searchTerm))
                .or(mrtmAccount.imoNumber.eq(searchTerm)));
    }
}