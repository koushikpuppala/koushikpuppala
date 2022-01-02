/** @format */

import React from 'react'
import { Chip } from '@material-ui/core'
import { VerifiedUserTwoTone } from '@material-ui/icons'
import { TechData } from '../data/Technology'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'

// import Swiper core and required modules
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from 'swiper/core'

// install Swiper modules
SwiperCore.use([Autoplay, EffectCoverflow, Pagination])

class Technology extends React.Component {
	shouldComponentUpdate() {
		return false
	}
	render() {
		return (
			<div>
				<section id='tech' className='services'>
					<div className='container'>
						<div className='section-title'>
							<h2 data-aos='fade-right'>Technologies</h2>
						</div>
						<Swiper
							effect={'coverflow'}
							centeredSlides={true}
							slidesPerView={'auto'}
							loop={true}
							loopFillGroupWithBlank={true}
							coverflowEffect={{
								rotate: 50,
								stretch: 0,
								depth: 100,
								modifier: 1,
								slideShadows: true,
							}}
							autoplay={{
								delay: 2500,
								disableOnInteraction: false,
							}}
							className='mySwiper'
							data-aos='fade-up'>
							{TechData.map((e) => {
								return (
									<SwiperSlide key={e.Id}>
										<img
											src={e.ImageUrl}
											alt={e.Name}
											width={300}
											height={300}
										/>
										<h3>
											{e.Name}
											<br />
											{e.Using ? (
												<Chip
													variant='outlined'
													color='secondary'
													size='small'
													label='Active in Projects'
													icon={<VerifiedUserTwoTone />}
												/>
											) : (
												''
											)}
										</h3>
									</SwiperSlide>
								)
							})}
						</Swiper>
					</div>
				</section>
			</div>
		)
	}
}

export default Technology
