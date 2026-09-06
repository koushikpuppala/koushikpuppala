'use client'

import { useState, type FormEvent } from 'react'
import { AlertCircle, RefreshCw, Shield, ShieldCheck, Sparkles } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/lib/auth'

export const LoginClientView = () => {
	const { login, loginWithGoogle, loginAsDemo, loading } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		if (!email || !password) {
			setError('Please enter both email and password.')
			return
		}
		setError(null)
		setSubmitting(true)
		try {
			await login(email, password)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Invalid credentials or login failed.')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<div className='flex min-h-[85vh] items-center justify-center px-4 py-12 sm:px-6'>
			<div className='w-full max-w-md space-y-8'>
				{/* Brand Logo & Heading */}
				<div className='space-y-2 text-center'>
					<div className='bg-signal mx-auto grid size-12 place-items-center rounded-2xl font-mono text-xl font-bold text-white shadow-lg'>
						KP
					</div>
					<h1 className='font-display text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
						Content Studio
					</h1>
					<p className='text-muted-foreground font-mono text-xs'>
						admin.koushikpuppala.com · Authenticated Console
					</p>
				</div>

				{/* Login Card */}
				<div className='border-border bg-surface space-y-6 rounded-2xl border p-7 shadow-xl sm:p-9'>
					{error && (
						<div className='border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-xl border p-3.5 font-mono text-xs'>
							<AlertCircle className='size-4 shrink-0' />
							<span>{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='space-y-1.5'>
							<Label htmlFor='email' className='text-muted-foreground font-mono text-xs uppercase'>
								Email Address
							</Label>
							<div className='relative'>
								<Input
									id='email'
									type='email'
									value={email}
									onChange={e => setEmail(e.target.value)}
									placeholder='koushikpuppala@koushikpuppala.com'
									autoComplete='email'
									required
									className='h-10 font-mono text-sm'
								/>
							</div>
						</div>

						<div className='space-y-1.5'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='pass' className='text-muted-foreground font-mono text-xs uppercase'>
									Security Key / Password
								</Label>
							</div>
							<Input
								id='pass'
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								placeholder='••••••••••••'
								autoComplete='current-password'
								required
								className='h-10 font-mono text-sm'
							/>
						</div>

						<Button
							type='submit'
							variant='signal'
							className='h-10 w-full cursor-pointer text-sm font-semibold'
							disabled={submitting || loading}>
							{submitting ? (
								<>
									<RefreshCw className='size-4 animate-spin' />
									<span>Verifying Credentials…</span>
								</>
							) : (
								<span>Sign In with Credentials</span>
							)}
						</Button>
					</form>

					<div className='relative flex items-center justify-center'>
						<span className='border-border w-full border-t' />
						<span className='bg-surface text-muted-foreground px-3 font-mono text-[0.625rem] text-nowrap uppercase'>
							Or fast access
						</span>
						<span className='border-border w-full border-t' />
					</div>

					<div className='space-y-2.5'>
						<Button
							type='button'
							variant='outline'
							onClick={() => loginWithGoogle()}
							className='h-10 w-full cursor-pointer font-mono text-xs'>
							<Shield className='text-signal-ink size-3.5' />
							<span>Sign In with Google</span>
						</Button>

						<Button
							type='button'
							variant='secondary'
							onClick={loginAsDemo}
							className='border-border/80 h-10 w-full cursor-pointer border font-mono text-xs'>
							<Sparkles className='text-signal-ink size-3.5' />
							<span>1-Click Local Dev Admin Access</span>
						</Button>
					</div>
				</div>

				<div className='text-muted-foreground flex items-center justify-center gap-2 text-center font-mono text-xs'>
					<ShieldCheck className='text-signal-ink size-4 shrink-0' />
					<span>Protected by Firebase Authentication &amp; NestJS RBAC Guard</span>
				</div>
			</div>
		</div>
	)
}
