import { DTO_FIELDS, type DtoEntity } from 'types'
import { describe, expect, it } from 'vitest'
import { getMetadataStorage } from 'class-validator'
import { CreateHomeDto } from 'modules/home/home.dto'
import { CreateAboutDto } from 'modules/about/about.dto'
import { CreateSkillDto } from 'modules/skill/skill.dto'
import { CreateProjectDto } from 'modules/project/project.dto'
import { CreateServiceDto } from 'modules/service/service.dto'
import { CreateEducationDto } from 'modules/education/education.dto'
import { CreateExperienceDto } from 'modules/experience/experience.dto'
import { CreateSocialDto } from 'modules/social/social.dto'
import { CreateResumeDto } from 'modules/resume/resume.dto'
import { CreateMetadataDto } from 'modules/metadata/metadata.dto'
import { UpdateContactDto } from 'modules/contact/contact.dto'

const DTOS: Record<DtoEntity, new () => object> = {
	home: CreateHomeDto,
	about: CreateAboutDto,
	skill: CreateSkillDto,
	project: CreateProjectDto,
	service: CreateServiceDto,
	education: CreateEducationDto,
	experience: CreateExperienceDto,
	social: CreateSocialDto,
	resume: CreateResumeDto,
	metadata: CreateMetadataDto,
	contactUpdate: UpdateContactDto,
}

const validatedProperties = (dto: new () => object) =>
	[
		...new Set(
			getMetadataStorage()
				.getTargetValidationMetadatas(dto, '', true, false)
				.map(meta => meta.propertyName),
		),
	].sort()

describe('admin payload contract', () => {
	it.each(Object.keys(DTOS) as DtoEntity[])('DTO_FIELDS.%s matches the server DTO', entity => {
		expect([...DTO_FIELDS[entity]].sort()).toEqual(validatedProperties(DTOS[entity]))
	})
})
