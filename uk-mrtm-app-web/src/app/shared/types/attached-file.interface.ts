import { Params } from '@angular/router';

export interface AttachedFile {
  downloadUrl: string;
  fileName: string;
  /** Optional query params of the download link, e.g. the decision notification of a document preview. */
  queryParams?: Params;
}
