import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class OptionalIntPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) return value;
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      return undefined;
    }
    return val;
  }
}
