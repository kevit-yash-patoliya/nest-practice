import {
  Controller, Get, Param, Query,
  ParseIntPipe, ParseFloatPipe, ParseBoolPipe,
  ParseArrayPipe, ParseUUIDPipe, ParseEnumPipe,
  DefaultValuePipe
} from '@nestjs/common';

enum Role { Admin = 'admin', User = 'user' }

@Controller('items')
export class ItemsController {

  // ParseIntPipe
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id); // 'number'
    return { id };
  }

  // ParseFloatPipe
  @Get('price/:amount')
  getPrice(@Param('amount', ParseFloatPipe) amount: number) {
    return { amount };
  }

  // ParseBoolPipe
  @Get('search')
  search(@Query('active', ParseBoolPipe) active: boolean) {
    return { active };
  }

  // ParseArrayPipe
  @Get('filter')
  filter(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[]) {
    return { ids }; // ?ids=1,2,3 → [1, 2, 3]
  }

  // ParseUUIDPipe
  @Get('uuid/:id')
  findByUuid(@Param('id', new ParseUUIDPipe()) id: string) {
    return { id };
  }

  // ParseEnumPipe
  @Get('role/:role')
  getByRole(@Param('role', new ParseEnumPipe(Role)) role: Role) {
    return { role };
  }

  // DefaultValuePipe (often combined with ParseIntPipe)
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return { page, limit };
  }
}