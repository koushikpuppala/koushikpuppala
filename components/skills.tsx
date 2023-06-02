import { useEffect } from 'react'
import { SkillsAction } from '@import/actions'
import { SkillsData } from '@import/data'

const Skills = () => {
	useEffect(() => {
		SkillsAction()
	}, [])

	return (
		<div className='skills container'>
			<div
				className='section-title'
				data-aos='fade-right'>
				<h2>Skills</h2>
			</div>

			<div className='row skills-content'>
				{SkillsData.map(skill => (
					<div
						className='col-lg-6'
						data-aos='fade-up'
						key={skill.id}>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								{skill.name} <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-label={skill.name}
									aria-valuenow={skill.percentage}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default Skills
