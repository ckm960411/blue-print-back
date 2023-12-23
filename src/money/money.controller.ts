import { Controller } from '@nestjs/common';
import { MoneyService } from './money.service';

@Controller('money')
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}
}
