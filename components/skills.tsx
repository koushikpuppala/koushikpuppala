import type { NextComponentType } from 'next'
import { useEffect } from 'react'
import { SkillsAction } from '@import/actions'

const Skills: NextComponentType = () => {
	useEffect(() => {
		SkillsAction()
	}, [])

	return (
		<>
			<div className='skills container'>
				<div
					className='section-title'
					data-aos='fade-right'>
					<h2>Skills</h2>
				</div>

				<div className='row skills-content'>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								NodeJs <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								HTML <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								Express <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								JavaScript <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={90}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								EJS <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={90}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								CSS <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								React <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								Nextjs <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								MongoDB <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={75}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div
						className='col-lg-6'
						data-aos='fade-up'>
						<div
							className='progress'
							data-aos='flip-left'>
							<span className='skill'>
								TypeScript <i className='val'></i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar progress-bar-striped progress-bar-animated'
									role='progressbar'
									aria-valuenow={40}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Skills
