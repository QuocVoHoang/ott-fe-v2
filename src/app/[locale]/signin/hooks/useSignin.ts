'use client'

import axios from "axios";
import { useRouter } from '@/i18n/routing';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAtom } from "jotai";
import { isAuthenticatedState, isPageLoadingState } from "@/jotai/jotai-state";
import { useState } from "react";
import { API_SERVER } from "@/constants/constants";

interface ISchemaData {
  email: string;
  password: string;
}

interface IError {
  status: number
}

const schema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  password: Yup.string()
    .min(4)
    .required('Password is required'),
});

export const useSignin = () => {
  const router = useRouter()
  const [, setIsAuthenticated] = useAtom(isAuthenticatedState)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [, setIsPageLoading] = useAtom(isPageLoadingState)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError
  } = useForm<ISchemaData>({
    resolver: yupResolver(schema),
    mode: 'onTouched'
  });
  const [phone, setPhone] = useState<string>('')
  const [isPhone, setIsPhone] = useState<boolean>(false)

  const [otp, setOtp] = useState<string>('')
  const [inputOtp, setInputOtp] = useState<string>('')
  const [sendOtp, setSendOtp] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onChangePhoneNumber = (e: string) => {
    setPhone(e)
  }

  const onSendOtp = async () => {
    try {
      setIsLoading(true)
      setSendOtp(true)
      const temp_otp = Math.floor(100000 + Math.random() * 900000)
      setOtp(`${temp_otp}`)
      const response = await axios.post(`${API_SERVER}/sns/send-sms`, {
        phone_number: `${phone}`,
        message: `Registration OTP: ${temp_otp}`
      })
      if (response) {
        if(response.data.access_token) {
          setIsLoading(false)
          localStorage.setItem("token", response.data.access_token)
          setIsAuthenticated(true)
          setSendOtp(false)
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  const onCreatePhoneUser = async () => {
    if (inputOtp === otp) {
      try {
        const response = await axios.post(`${API_SERVER}/user/signup`, {
          username: phone,
          email: phone,
          password: phone
        })
        if (response) {
          localStorage.setItem("token", response.data.access_token)
          setIsAuthenticated(true)
        }
      } catch (e) {
        const error = e as IError
        console.error(e)
        if (error.status === 401) {
          setError("email", { type: "custom", message: "Phone is not registered!" })
        }
      } finally {
        setIsPageLoading(false)
      }
    }
  }

  const onSubmit = async (data: ISchemaData) => {
    try {
      const response = await axios.post(`${API_SERVER}/user/signin`, {
        email: data.email,
        password: data.password
      })
      if (response.status === 200) {
        localStorage.setItem("token", response.data.access_token)
        reset()
        setIsAuthenticated(true)
      }
    } catch (e) {
      const error = e as IError
      console.error(e)
      if (error.status === 404) {
        setError("email", { type: "custom", message: "Email is not registered!" })
      }
    } finally {
      setIsPageLoading(false)
    }
  }

  const onToggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }

  return {
    router: router,
    isValid: isValid,
    errors: errors,
    showPassword: showPassword,
    phone: phone,
    isPhone: isPhone,
    isLoading: isLoading,
    sendOtp: sendOtp,
    inputOtp: inputOtp,

    onChangePhoneNumber: onChangePhoneNumber,
    setIsPhone: setIsPhone,
    onToggleShowPassword: onToggleShowPassword,
    register: register,
    onSubmit: onSubmit,
    handleSubmit: handleSubmit,
    setIsPageLoading: setIsPageLoading,
    onSendOtp: onSendOtp,
    setInputOtp: setInputOtp,
    onCreatePhoneUser: onCreatePhoneUser
  }
}
