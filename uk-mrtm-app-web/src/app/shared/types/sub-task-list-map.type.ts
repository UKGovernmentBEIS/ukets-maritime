export type SubTaskListMap<T> = {
  title: string;
  description?: string;
  caption?: string;
} & Partial<{
  [K in keyof T]: {
    title: string;
    description?: string;
    caption?: string;
  };
}>;
