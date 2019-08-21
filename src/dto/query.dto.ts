import { ApiModelProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiModelProperty({
    description: 'URL id',
  })
  id: string;
}
