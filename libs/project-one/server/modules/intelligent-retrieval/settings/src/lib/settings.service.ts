import { Injectable } from '@nestjs/common';
import { IntelligentRetrievalRepo } from '@mn/project-one/server/repos/intelligent-retrieval';
import { IntelligentRetrievalSettingsEntity } from './entities/intelligent-retrieval-settings.entity';
import { UpdateSettingsRequestDto } from './dtos/update-settings-request.dto';

@Injectable()
export class SettingsService {
  constructor(private repo: IntelligentRetrievalRepo) {}

  async getSettings(
    tenantId: string
  ): Promise<IntelligentRetrievalSettingsEntity> {
    const settings = await this.repo.getSettings(tenantId);

    if (!settings) {
      throw new Error('Settings not found');
    }
    return settings;
  }

  async upsertSettings(
    tenantId: string,
    dto: UpdateSettingsRequestDto
  ): Promise<IntelligentRetrievalSettingsEntity> {
    return await this.repo.upsertSettings(
      tenantId,
      dto.generativeModel
    );
  }
}
