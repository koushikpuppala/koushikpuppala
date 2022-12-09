import type { NextComponentType } from 'next'
import { useEffect } from 'react'
import { SkillsAction } from '@import/actions'
import { SkillsStyles as styles } from '@import/styles/components'
import { SkillsData } from '@import/skills'

const Skills: NextComponentType = () => {
	useEffect(() => {
		SkillsAction(styles['progress'], styles['progress-bar'], styles['val'])
	}, [])

	return (
		<>
			<div className={`${styles['skills']} container skills`}>
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
								className={`progress ${styles['progress']}`}
								data-aos='flip-left'>
								<span className={styles['skill']}>
									{skill.name} <i className={styles['val']}></i>
								</span>
								<div className={styles['progress-bar-wrap']}>
									<div
										className={`${styles['progress-bar']} progress-bar-striped progress-bar-animated`}
										role='progressbar'
										aria-valuenow={skill.percentage}
										aria-valuemin={0}
										aria-valuemax={100}></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default Skills
