import { ApiModelProperty } from '@nestjs/swagger';

export class RedirectDto {
  @ApiModelProperty({
    description: 'URL id',
  })
  id: string;
}
