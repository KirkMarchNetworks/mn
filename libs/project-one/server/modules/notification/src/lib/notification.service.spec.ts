import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from "./notification.service";
import { mock } from "jest-mock-extended";
import { NotificationSendToInterface } from "./models/notification-send-to.interface";
import { WebSocketService } from "../web-socket/web-socket.service";
import { FirebaseService } from "../firebase/firebase.service";

describe('NotificationService', () => {
  let service: NotificationService;
  let webSocketServiceMock: WebSocketService;
  let firebaseServiceMock: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
      ],
    })
      .useMocker(mock)
      .compile();

    service = module.get(NotificationService);
    webSocketServiceMock = module.get(WebSocketService);
    firebaseServiceMock = module.get(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Usually you should not test private methods, this was just a test to see if it was possible
  it('should remove duplicate sendTos', () => {
    const sendTos: NotificationSendToInterface[] = [
      {
        userId: "1",
        protocols: [
          "any"
        ]
      },
      {
        userId: "1",
        protocols: [
          "any"
        ]
      }
    ];
    const removals = service['_removeDuplicates'](sendTos);
    expect(removals.size).toBe(1);
  });

  it('should send a message to one user via websocket and another user via push', async () => {
    const sendTos: NotificationSendToInterface[] = [
      {
        userId: "1",
        protocols: [
          "any"
        ]
      },
      {
        userId: "2",
        protocols: [
          "any"
        ]
      }
    ];

    const socketSpy = jest.spyOn(webSocketServiceMock, 'sendMessageToUsers').mockResolvedValueOnce([ '1' ]);
    const firebaseSpy = jest.spyOn(firebaseServiceMock, 'sendMessageToUserIds').mockResolvedValueOnce([ '2' ]);

    await service.sendMessageTo(sendTos, { title: 'test', body: 'test' });
    expect(socketSpy).toHaveBeenCalledTimes(1);
    expect(firebaseSpy).toHaveBeenCalledTimes(1);
  });
});
