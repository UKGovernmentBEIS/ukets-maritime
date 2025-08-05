import { MrtmItemDTO } from '@mrtm/api';

export type ItemNameTransformer = (taskType: MrtmItemDTO['taskType'], year?: string | number) => string;
