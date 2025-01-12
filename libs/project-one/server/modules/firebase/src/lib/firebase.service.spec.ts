import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';
import { mock } from "jest-mock-extended";
import firebaseConfig from "../../../config/models/firebase-config";

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseService,
        {
          provide: firebaseConfig.KEY,
          useValue: {
            serviceAccountPath: 'apps/server/src/environments/mn-f4453-firebase-adminsdk-xgt86-a26533931c.json'
          }
        }
      ],
    })
      .useMocker(mock)
      .compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
