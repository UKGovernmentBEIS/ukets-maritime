import { FileInfoDTO, RequestActionUserInfo } from '@mrtm/api';

import { UserInfoResolverPipe } from '@shared/pipes';
import { AttachedFile, OfficialNoticeInfo } from '@shared/types';

const getOfficialNoticeInfo = (
  usersInfo: {
    [key: string]: RequestActionUserInfo;
  },
  signatory: string,
  officialDocument: FileInfoDTO,
  downloadUrl: string,
): OfficialNoticeInfo => {
  const userInfoResolverPipe = new UserInfoResolverPipe();
  return {
    users: Object.keys(usersInfo ?? {})
      .filter((id) => id !== signatory)
      .map((id) => userInfoResolverPipe.transform(id, usersInfo)),
    signatory: usersInfo?.[signatory],
    officialNotice: officialDocument
      ? [
          {
            fileName: officialDocument.name,
            downloadUrl: getOfficialNoticeUrl(downloadUrl, officialDocument.uuid),
          },
        ]
      : null,
  };
};

const getOfficialNoticeUrl = (downloadUrl: string, id: string) => {
  return `${downloadUrl}document/${id}`;
};

const getAttachedFiles = (
  files: string[],
  attachments: {
    [key: string]: string;
  },
  downloadUrl: string,
  isRfiOrRde: boolean = false,
): AttachedFile[] => {
  return (
    files?.map((id) => ({
      downloadUrl: isRfiOrRde ? `${downloadUrl}attachment/${id}` : downloadUrl + id,
      fileName: attachments?.[id],
    })) ?? []
  );
};

export const timelineUtils = {
  getOfficialNoticeInfo,
  getOfficialNoticeUrl,
  getAttachedFiles,
};
