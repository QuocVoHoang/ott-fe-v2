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
		.required('Password is required')
});

export const useSignup = () => {
	const router = useRouter()
	const [, setIsAuthenticated] = useAtom(isAuthenticatedState)
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [, setIsPageLoading] = useAtom(isPageLoadingState)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [otp, setOtp] = useState<string>('')
	const [inputOtp, setInputOtp] = useState<string>('')
	const [sendOtp, setSendOtp] = useState<boolean>(false)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
		setError,
		watch
	} = useForm<ISchemaData>({
		resolver: yupResolver(schema),
		mode: 'onTouched'
	});

	const formdata = watch()

	const onSendGmailOtp = async () => {
		try {
			setIsLoading(true)
			setSendOtp(true)
			const temp_otp = Math.floor(100000 + Math.random() * 900000)
			console.log(temp_otp)
			setOtp(`${temp_otp}`)
			const response = await axios.post(`${API_SERVER}/sns/send-email`, {
				email: `${formdata.email}`,
				message: `Your registration OTP: ${temp_otp}`,
				subject: "Registration OTP"
			})
			if (response) {
				console.log('rs', response.data)
				setIsLoading(false)
				if (response.data.message) {
					// setSendOtp(false)
					// setError("email", { type: "custom", message: "Email already registered!" })
				}
			}
		} catch (e) {
			console.error(e)
		} finally {
			setIsLoading(false)
		}
	}

	const onSubmit = async () => {
		if (otp === inputOtp) {
			try {
				const response = await axios.post(`${API_SERVER}/user/signup`, {
					username: formdata.email,
					email: formdata.email,
					password: formdata.password
				},
					{
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						}
					})
				if (response) {
					setIsPageLoading(true)
					localStorage.setItem('token', response.data.access_token)
					setIsAuthenticated(true)
					reset()
				}
			} catch (e) {
				const error = e as IError
				console.error(e)
				if (error.status === 400) {
					setError("email", { type: "custom", message: "Email already registered!" })
				}
			} finally {
				setIsPageLoading(false)
			}
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
		isLoading: isLoading,
		inputOtp: inputOtp,
		sendOtp: sendOtp,

		setInputOtp: setInputOtp,
		onToggleShowPassword: onToggleShowPassword,
		handleSubmit: handleSubmit,
		onSubmit: onSubmit,
		register: register,
		setIsPageLoading: setIsPageLoading,
		onSendGmailOtp: onSendGmailOtp
	}
}
