"use client"

import { Mail, Lock, Eye, EyeClosed } from 'lucide-react';
import { useSignup } from './hooks/useSignup';
import React from 'react';
import { useTranslations } from 'next-intl';
import InputField from '@/components/InputField/InputField';

export default function Page() {
  const {
    router,
    errors,
    showPassword,
    isLoading,
    inputOtp,
    sendOtp,

    setInputOtp,
    onToggleShowPassword,
    onSubmit,
    register,
    setIsPageLoading,
    onSendGmailOtp
  } = useSignup()
  const t = useTranslations('SignupPage');

  return (
    <div
      className='w-screen h-screen bg-[#F5F5F5] flex items-center justify-center'
    >
      <div className='w-[488px] h-fit rounded-2xl bg-[#FFFFFF] py-7 px-14 flex flex-col items-center relative'>
        <span className='font-medium text-[28px]'>{t('title')}</span>

        <form>
          <div className='mt-2 w-[376px]'>
            <InputField
              startIcon={<Mail className="w-4 h-4 absolute left-3 top-1/3 text-gray-400" />}
              placeholder={t('emailAddress')}
              {...register('email')}
            />
          </div>
          <span className='text-red-700'>{errors.email?.message}</span>

          <div className='mt-2 w-[376px]'>
            <InputField
              startIcon={<Lock className="w-4 h-4 absolute left-3 top-1/3 text-gray-400" />}
              endIcon={showPassword ? <Eye className='w-4 h-4' /> : <EyeClosed className='w-4 h-4' />}
              placeholder={t('password')}
              {...register('password')}
              type={showPassword ? "text" : "password"}
              onShowPassword={onToggleShowPassword}
            />
          </div>
          <span className='text-red-700'>{errors.password?.message}</span>

          {isLoading &&
            <div className='ml-2 w-full h-full flex justify-center items-center mt-4'>
              <div className="w-10 h-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
            </div>
          }

          {(!isLoading && sendOtp) &&
            <div className='mt-4'>
              <InputField
                placeholder='OTP'
                type={"text"}
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
              />
            </div>
          }

          <button
            className='mt-5 w-full h-[44px] bg-[#F26B42] text-white text-sm rounded-lg shadow-md active:shadow-none active:translate-y-1 transition'
            type='button'
            onClick={sendOtp ? onSubmit : onSendGmailOtp}
          >
            {sendOtp ? t('signupButton') : t('sendOtpButton')}
          </button>
        </form>

        <div className='w-full flex items-center mt-5 relative'>
          <hr className="w-[40%] border border-[#C8C8C8]" />
          <span className='w-[20%] px-3 flex justify-center'>{t('or')}</span>
          <hr className="w-[40%] border border-[#C8C8C8]" />
        </div>

        <div className='mt-5 text-sm text-[#5B5B5B]'>
          <span> {t('subtitle')}
            <span
              className='text-[#F26B42] ml-2 cursor-pointer'
              onClick={() => {
                setIsPageLoading(true)
                router.push('/signin')
              }
              }
            >
              {t('signinButton')}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}