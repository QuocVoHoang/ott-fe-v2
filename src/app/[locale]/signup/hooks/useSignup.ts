'use client'

import axios from "axios";
import { useRouter} from '@/i18n/routing';
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
  confirmPassword: string;
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
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm password does not match')
    .required('Confirm password is required'),
});

export const useSignup = () => {
	const router = useRouter()
	const [ , setIsAuthenticated] = useAtom(isAuthenticatedState)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [, setIsPageLoading] = useAtom(isPageLoadingState)

	const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setError,
  } = useForm<ISchemaData>({
    resolver: yupResolver(schema),
		mode: 'onTouched'
  });

	const onSubmit = async (data: ISchemaData) => {
    try {
			const response = await axios.post(`${API_SERVER}/user/signup`, {
				username: data.email,
				email: data.email,
				password: data.password
			},
			{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
			if(response) {
				setIsPageLoading(true)
				localStorage.setItem('token', response.data.access_token)
				setIsAuthenticated(true)
				reset()
			}
    } catch (e) {
			const error = e as IError
			console.error(e)
			if(error.status === 400) {
				setError("email", { type: "custom", message: "Email already registered!" })
			}
    } finally {
			setIsPageLoading(false)
		}
  }

	const onToggleShowPassword =() => {
    setShowPassword(prev => !prev)
  }

	return {
		router: router,
		isValid: isValid,
		errors: errors,
		showPassword: showPassword,

		onToggleShowPassword: onToggleShowPassword,
		handleSubmit: handleSubmit,
		onSubmit: onSubmit,
		register: register,
		setIsPageLoading: setIsPageLoading,
	}
}
