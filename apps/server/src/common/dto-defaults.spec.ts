import { describe, expect, it } from 'vitest'
import { plainToInstance } from 'class-transformer'
import { UpdateHomeDto } from 'modules/home/home.dto'
import { UpdateAboutDto } from 'modules/about/about.dto'
import { UpdateSkillDto } from 'modules/skill/skill.dto'
import { UpdateSocialDto } from 'modules/social/social.dto'
import { UpdateResumeDto } from 'modules/resume/resume.dto'
import { UpdateServiceDto } from 'modules/service/service.dto'
import { UpdateMetadataDto } from 'modules/metadata/metadata.dto'
import { UpdateEducationDto } from 'modules/education/education.dto'
import { UpdateExperienceDto } from 'modules/experience/experience.dto'
import { UpdateGalleryMediaDto, UpdateProjectDto } from 'modules/project/project.dto'

const UPDATE_DTOS: Record<string, new () => object> = {
	UpdateHomeDto,
	UpdateAboutDto,
	UpdateSkillDto,
	UpdateSocialDto,
	UpdateResumeDto,
	UpdateServiceDto,
	UpdateProjectDto,
	UpdateMetadataDto,
	UpdateEducationDto,
	UpdateExperienceDto,
	UpdateGalleryMediaDto,
}

describe('Update DTOs', () => {
	it.each(Object.entries(UPDATE_DTOS))('%s has no default values', (_name, dto) => {
		expect({ ...plainToInstance(dto, {}) }).toEqual({})
	})

	it('keep exactly the fields that were sent', () => {
		expect({ ...plainToInstance(UpdateProjectDto, { title: 'Renamed' }) }).toEqual({
			title: 'Renamed',
		})
	})
})
