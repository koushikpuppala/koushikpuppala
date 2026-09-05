import { IsInt, IsPositive, IsString, MaxLength, Min } from 'class-validator'

export class ApiMetricDto {
	@IsString()
	@MaxLength(500)
	endpoint!: string

	@IsString()
	@MaxLength(10)
	method!: string

	@IsInt()
	@Min(100)
	statusCode!: number

	@IsInt()
	@IsPositive()
	duration!: number
}
