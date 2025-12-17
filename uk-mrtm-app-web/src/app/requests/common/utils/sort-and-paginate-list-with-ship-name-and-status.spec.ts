import { TaskItemStatus } from '@requests/common';
import { sortAndPaginateListWithShipNameAndStatus } from '@requests/common/utils/sort-and-paginate-list-with-ship-name-and-status';

describe('sortAndPaginateListWithShipNameAndStatus', () => {
  const mock_data = [
    { id: '1', name: 'Epsilon', departureTime: new Date('2022-11-10').toISOString(), status: TaskItemStatus.COMPLETED },
    {
      id: '2',
      name: 'Epsilon',
      departureTime: new Date('2025-11-12').toISOString(),
      status: TaskItemStatus.IN_PROGRESS,
    },
    { id: '3', name: 'Epsilon', status: TaskItemStatus.IN_PROGRESS },
    {
      id: '4',
      name: 'Epsilon',
      departureTime: new Date('2025-10-12').toISOString(),
      status: TaskItemStatus.IN_PROGRESS,
    },
    { id: '5', name: 'Kappa', departureTime: new Date('2025-12-12').toISOString(), status: TaskItemStatus.IN_PROGRESS },
    {
      id: '6',
      name: 'Epsilon',
      departureTime: new Date('2025-12-26').toISOString(),
      status: TaskItemStatus.IN_PROGRESS,
    },
  ];

  it('should sort order by status', () => {
    expect(
      sortAndPaginateListWithShipNameAndStatus(
        [
          { column: 'name', direction: 'ascending' },
          { column: 'status', direction: 'descending' },
          { column: 'departureTime', direction: 'ascending' },
        ],
        mock_data,
        1,
        1000,
      ).map((x) => x.id),
    ).toEqual(['4', '2', '6', '3', '1', '5']);
  });
});
