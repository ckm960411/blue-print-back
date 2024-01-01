import { Test, TestingModule } from '@nestjs/testing';
import { MoneyController } from './money.controller';

describe('MoneyController', () => {
  let controller: MoneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoneyController],
    }).compile();

    controller = module.get<MoneyController>(MoneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
