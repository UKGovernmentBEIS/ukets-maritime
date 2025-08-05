import { UploadedFile } from '@shared/types';

export const transformToTaskAttachments = (filesToUpload?: UploadedFile[]): { [uuid: string]: string } => {
  return filesToUpload?.reduce((acc, file) => ({ ...acc, [file.uuid]: file.file.name }), {});
};

export const createFileUploadPayload = (filesToUpload?: UploadedFile[]): string[] => {
  return filesToUpload ? filesToUpload?.map((file) => file.uuid) : null;
};
