import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiModelProperty({
    description: 'Original URL',
  })
  url: string;
}
