import { TusMetadataHeaderName } from '@mn/project-one/shared/models';
import { Headers } from '@nestjs/common';

export function TusHeader() {
  return Headers(TusMetadataHeaderName)
}
