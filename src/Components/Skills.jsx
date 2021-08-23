/** @format */

import React from 'react'
import { SkillsData } from '../Data/Skills'
import { v4 as uuidv4 } from 'uuid'
import '../Stylesheets/Skills.css'

class Skills extends React.Component {
	render() {
		return (
			<div>
				<section id='skills' className='skills section-bg'>
					<div className='container'>
						<div className='section-title'>
							<h2>Skills</h2>
							<p></p>
						</div>

						{SkillsData.map((e) => {
							return (
								<div className='row skills-content' key={uuidv4}>
									<div className='col-lg-6' data-aos='fade-up'>
										{e.Frontend.map((e) => {
											return (
												<div className='progress' key={e.Id}>
													<span className='skill'>
														{e.Name} <i className='val'>{e.Width}%</i>
													</span>
													<div className='progress-bar-wrap'>
														<div
															className='bg-info progress-bar progress-bar-striped progress-bar-animated'
															role='progressbar'
															aria-label={e.Name}
															aria-valuenow={e.Width}
															aria-valuemin='0'
															aria-valuemax='100'
															style={{
																width: `${e.Width}%`,
															}}></div>
													</div>
												</div>
											)
										})}
									</div>
									<div className='col-lg-6' data-aos='fade-up'>
										{e.Backend.map((e) => {
											return (
												<div className='progress' key={e.Id}>
													<span className='skill'>
														{e.Name} <i className='val'>{e.Width}%</i>
													</span>
													<div className='progress-bar-wrap'>
														<div
															className='bg-info progress-bar progress-bar-striped progress-bar-animated'
															role='progressbar'
															aria-label={e.Name}
															aria-valuenow={e.Width}
															aria-valuemin='0'
															aria-valuemax='100'
															style={{
																width: `${e.Width}%`,
															}}></div>
													</div>
												</div>
											)
										})}
									</div>
								</div>
							)
						})}
					</div>
				</section>
			</div>
		)
	}
}

export default Skills
