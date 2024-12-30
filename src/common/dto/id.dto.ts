import { Type } from "class-transformer";
import { IsPositive } from "class-validator";


export class IdDto{
  @IsPositive()
  @Type(() => Number)
  id: number
}