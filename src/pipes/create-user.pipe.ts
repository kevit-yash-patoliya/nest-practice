import { ArgumentMetadata, PipeTransform } from "@nestjs/common";

export class CreateUserPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(metadata,'meta data')
    value.email = value.email.toUpperCase();
    
    return value;
  }
}