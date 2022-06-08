import type { NextComponentType } from 'next'

const Skills: NextComponentType = () => {
	return (
		<>
			<div className='skills container'>
				<div className='section-title'>
					<h2>Skills</h2>
				</div>

				<div className='row skills-content'>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								NodeJs <i className='val'>100%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								HTML <i className='val'>100%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								Express <i className='val'>100%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={100}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								JavaScript <i className='val'>90%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={90}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								EJS <i className='val'>90%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={90}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								CSS <i className='val'>80%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								React <i className='val'>80%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								Nextjs <i className='val'>80%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={80}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								MongoDB <i className='val'>75%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
									role='progressbar'
									aria-valuenow={75}
									aria-valuemin={0}
									aria-valuemax={100}></div>
							</div>
						</div>
					</div>
					<div className='col-lg-6'>
						<div className='progress'>
							<span className='skill'>
								TypeScript <i className='val'>40%</i>
							</span>
							<div className='progress-bar-wrap'>
								<div
									className='progress-bar'
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
