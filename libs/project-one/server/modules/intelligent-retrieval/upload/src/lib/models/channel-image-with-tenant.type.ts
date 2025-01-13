import { ChannelImageType } from '@mn/project-one/server/repos/intelligent-retrieval';

export type ChannelImageWithTenantType = ChannelImageType & {
  tenantId: string;
};
