'use client'

import { useState, useTransition } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'

import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'
import { useRouter } from 'next/navigation'

import { activation } from '@/lib/actions/auth/register'
import OtpInput from '../../../../../components/auth/otp-input'

import { CountdownCircleTimer } from 'react-countdown-circle-timer'
type FormData = {
  otp: string
}

export default function OtpForm({ params }: { params: { phone: string } }) {
  const router = useRouter()

  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  })
  // useEffect(() => {
  //   const sendReactiveSms = async () => {
  //     const Sms = await sendSms({ phone: params.phone })
  //     console.log(Sms)
  //   }
  //   sendReactiveSms()
  // }, [params.phone])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError('')
    setSuccess('')

    // setError(res?.error)
    // setSuccess(res?.success)
    startTransition(() => {
      activation({ phone: params.phone, verificationCode: data.otp }).then(
        (res) => {
          setError(res.error)
          setSuccess(res.success)
          if (res.success) {
            router.push(`/new-password/${params.phone}`)
          }
          if (res.error) {
            // router.push('/new-password')
            reset()
          }
        }
      )
    })
  }

  // Function to trigger form submission programmatically
  const handleComplete = () => {
    handleSubmit(onSubmit)() // Invoke the submit handler
  }

  return (
    <>
      <form dir="ltr" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-semibold text-sm md:text-2xl text-secondary mb-8 text-center">
          :لطفا کد ارسال شده را وارد کنید
        </h1>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <OtpInput
              disabled={isPending}
              value={value}
              valueLength={6}
              onChange={onChange}
              onComplete={handleComplete} // Pass the handleComplete function
            />
          )}
        />
        <section
          dir="ltr"
          className="flex flex-col justify-center items-center my-8"
        >
          <CountdownCircleTimer
            isPlaying
            duration={120}
            colors={['#ADD8E6', '#30e8bf', '#FFB6C1', '#e96f18']}
            colorsTime={[120, 60, 30, 15]}
            size={60}
            strokeWidth={10}
            onComplete={() => router.push('/login')}
            strokeLinecap={'butt'}
          >
            {({ remainingTime }) => remainingTime}
          </CountdownCircleTimer>
          <p className="text-xs md:text-sm text-blue-600 text-center pt-2 pb-8">
            مدت اعتبار دو دقیقه
          </p>
        </section>
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </>
  )
}
