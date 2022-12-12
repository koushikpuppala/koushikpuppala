const Skills = () => {
	const skillsContent = document.querySelector('.skills-content') as HTMLElement

	if (skillsContent) {
		const skillProcess: NodeListOf<HTMLElement> =
			document.querySelectorAll('.progress .progress-bar')

		const skillPercentage: NodeListOf<HTMLElement> = document.querySelectorAll('.progress .val')

		skillPercentage.forEach((percentage, per_index) => {
			skillProcess.forEach((process, pro_index) => {
				let width = 0
				if (per_index === pro_index) {
					const frame = () => {
						if (width >= Number(process.getAttribute('aria-valuenow') as string)) {
							clearInterval(interval)
							return
						} else {
							width++
							process.style.width = width + '%'
							percentage.innerHTML = width + '%'
						}
					}
					const interval = setInterval(frame, 100)
				}
			})
		})
	}
}

export default Skills
