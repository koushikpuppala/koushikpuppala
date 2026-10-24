import { AuthProvider, UserRole, UserStatus } from '@repo/prisma'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class AuthenticatedUserResponse {
	@ApiProperty({
		example: '123e4567-e89b-12d3-a456-426614174000',
		description: 'Internal user ID',
		required: false,
	})
	id?: string

	@ApiProperty({ example: 'john.doe@example.com', description: 'User email address' })
	email!: string

	@ApiPropertyOptional({
		enum: UserRole,
		example: UserRole.USER,
		description: 'Role assigned to the user',
	})
	role?: UserRole

	@ApiPropertyOptional({
		example: 'https://lh3.googleusercontent.com/...',
		description: 'Profile photo URL',
	})
	photoUrl?: string

	@ApiPropertyOptional({
		enum: UserStatus,
		example: UserStatus.ACTIVE,
		description: 'Current account status',
	})
	status?: UserStatus

	@ApiProperty({ example: 'firebase_uid_abc123', description: 'Firebase user UID' })
	firebaseUid!: string

	@ApiPropertyOptional({ example: 'John Doe', description: 'Display name' })
	displayName?: string

	@ApiProperty({
		enum: AuthProvider,
		example: AuthProvider.GOOGLE,
		description: 'Authentication provider',
	})
	provider!: AuthProvider

	@ApiProperty({ example: true, description: 'Whether the email has been verified' })
	emailVerified!: boolean
}
