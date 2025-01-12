import { Test } from '@nestjs/testing';
import { ProjectOneServerWebSocketService } from './project-one-server-web-socket.service';

describe('ProjectOneServerWebSocketService', () => {
  let service: ProjectOneServerWebSocketService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ProjectOneServerWebSocketService],
    }).compile();

    service = module.get(ProjectOneServerWebSocketService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
