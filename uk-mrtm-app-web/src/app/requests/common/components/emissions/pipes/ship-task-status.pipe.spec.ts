import { ShipTaskStatusPipe } from '@requests/common/components/emissions/pipes/ship-task-status.pipe';
import { TaskItemStatus } from '@requests/common/task-item-status';

describe('ShipTaskStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new ShipTaskStatusPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return correct value', () => {
    const pipe = new ShipTaskStatusPipe();

    expect(pipe.transform(TaskItemStatus.IN_PROGRESS)).toEqual('Incomplete');
    expect(pipe.transform(TaskItemStatus.COMPLETED)).toEqual('Completed');
  });
});
