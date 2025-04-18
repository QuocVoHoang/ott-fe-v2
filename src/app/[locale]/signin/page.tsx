'use client'

import { Mail, Lock, EyeClosed, Eye, Phone } from 'lucide-react';
import { useSignin } from './hooks/useSignin';
import { useTranslations } from 'next-intl';
import InputField from '@/components/InputField/InputField';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

export default function Page() {
  const {
    router,
    isValid,
    errors,
    showPassword,
    phone,
    isPhone,
    isLoading,
    sendOtp,
    inputOtp,

    onChangePhoneNumber,
    setIsPhone,
    onToggleShowPassword,
    register,
    onSubmit,
    handleSubmit,
    setIsPageLoading,
    onSendOtp,
    setInputOtp,
    onCreatePhoneUser
  } = useSignin()
  const t = useTranslations('SigninPage');

  return (
    <div
      className='w-screen h-screen bg-[#F5F5F5] flex items-center justify-center'
    >
      <div className='w-[488px] h-fit rounded-2xl bg-[#FFFFFF] py-7 px-14 flex flex-col items-center relative'>
        <span className='font-medium text-[28px]'>{t('title')}</span>

        <form onSubmit={handleSubmit(onSubmit)}>
          {!isPhone && <div className='w-[376px] mt-2'>
            <InputField
              startIcon={<Mail className="w-4 h-4 absolute left-3 top-1/3 text-gray-400" />}
              placeholder={t('emailAddress')}
              {...register('email')}
            />
          </div>}
          {!isPhone && <span className='text-red-700'>{errors.email?.message}</span>}

          {!isPhone && <div className='w-[376px] mt-2'>
            <InputField
              startIcon={<Lock className="w-4 h-4 absolute left-3 top-1/3 text-gray-400" />}
              endIcon={showPassword ? <Eye className='w-4 h-4' /> : <EyeClosed className='w-4 h-4' />}
              placeholder={t('password')}
              {...register('password')}
              type={showPassword ? "text" : "password"}
              onShowPassword={onToggleShowPassword}
            />
          </div>}
          {!isPhone && <span className='text-red-700'>{errors.password?.message}</span>}

          {isPhone &&
            <div className='flex flex-row'>
              <PhoneInput
                defaultCountry='VN'
                international
                withCountryCallingCode
                value={phone}
                onChange={(e) => onChangePhoneNumber(e!)}
                id="phone"
                className="bg-white text-gray-800 px-4 py-2 rounded-xl w-full 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   border border-gray-300 appearance-none shadow-none"
                placeholder="ex: +84 912 345 678"
              />
              {isLoading &&
                <div className='ml-2 w-10 h-full flex justify-center items-center'>
                  <div className="w-10 h-10 border-4 border-blue-500 border-solid border-t-transparent rounded-full animate-spin"></div>
                </div>
              }
            </div>
          }

          {(isPhone && sendOtp) &&
            <div className='flex items-center mt-4 w-[200px]'>
              <InputField
                type='text'
                onShowPassword={onToggleShowPassword}
                placeholder='OTP'
                className='w-full'
                value={inputOtp}
                onChange={(e) => setInputOtp(e.target.value)}
              />
            </div>
          }

          <div className='w-[376px] h-[50px] mt-4 flex flex-row justify-between'>
            <div
              className={`w-[49%] h-full flex justify-center items-center rounded-lg cursor-pointer hover:bg-slate-300 transition-all duration-300 ${!isPhone ? 'bg-green-400' : 'bg-gray-400'}`}
              onClick={() => setIsPhone(false)}
            >
              <Mail />
            </div>
            <div
              className={`w-[49%] h-full flex justify-center items-center rounded-lg cursor-pointer hover:bg-slate-300 transition-all duration-300 ${isPhone ? 'bg-green-400' : 'bg-gray-400'}`}
              onClick={() => setIsPhone(true)}
            >
              <Phone />
            </div>
          </div>

          {!isPhone && <button
            className='mt-5 w-full h-[44px] bg-[#F26B42] text-white text-sm rounded-lg shadow-md active:shadow-none active:translate-y-1 transition'
            type='submit'
            disabled={!isValid}
          >
            {t('signinButton')}
          </button>}

          {isPhone &&
            <button
              className='mt-5 w-full h-[44px] bg-[#F26B42] text-white text-sm rounded-lg shadow-md active:shadow-none active:translate-y-1 transition'
              type='button'
              onClick={sendOtp ? onCreatePhoneUser : onSendOtp}
            >
              {t('signinButton')}
            </button>
          }
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
                router.push('/signup')
              }}
            >
              {t('signupButton')}
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}