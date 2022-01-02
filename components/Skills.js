/** @format */

import React from 'react'
import { SkillsData } from '../data/Skills'
import { v4 as uuidv4 } from 'uuid'

export default class Skills extends React.Component {
	render() {
		return (
			<>
				<section id='skills' className='skills section-bg' data-aos='fade-right'>
					<div className='container'>
						<div className='section-title'>
							<h2>Skills</h2>
							<p></p>
						</div>
						{SkillsData.map((e) => {
							return (
								<div className='row skills-content' key={uuidv4}>
									<div className='col-lg-6'>
										{e.Frontend.map((frontend) => {
											return (
												<div
													className='progress'
													key={frontend.Id}
													data-aos='flip-left'>
													<span
														className='skill'
														style={{
															width: `${frontend.Width}%`,
														}}>
														{frontend.Name}{' '}
														<i className='val'>{frontend.Width}%</i>
													</span>
													<div className='progress-bar-wrap'>
														<div
															className='bg-info progress-bar progress-bar-striped progress-bar-animated'
															role='progressbar'
															aria-label={frontend.Name}
															aria-valuenow={frontend.Width}
															aria-valuemin='0'
															aria-valuemax='100'
															style={{
																width: `${frontend.Width}%`,
															}}></div>
													</div>
												</div>
											)
										})}
									</div>
									<div className='col-lg-6'>
										{e.Backend.map((backend) => {
											return (
												<div
													className='progress'
													key={backend.Id}
													data-aos='flip-left'>
													<span
														className='skill'
														style={{
															width: `${backend.Width}%`,
														}}>
														{backend.Name}{' '}
														<i className='val'>{backend.Width}%</i>
													</span>
													<div className='progress-bar-wrap'>
														<div
															className='bg-info progress-bar progress-bar-striped progress-bar-animated'
															role='progressbar'
															aria-label={backend.Name}
															aria-valuenow={backend.Width}
															aria-valuemin='0'
															aria-valuemax='100'
															style={{
																width: `${backend.Width}%`,
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
			</>
		)
	}
}
