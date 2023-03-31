// Images
import EmailImage from '@/assets/signup/email.svg';
import EyeImage from '@/assets/signup/eye.svg';
import Brand from '@/assets/brand.svg';
import Divider from '@/assets/signup/line.svg';
import GoogleImage from '@/assets/signup/google.svg';
import Mask from '@/assets/signup/mask.svg';
import BackgroundBlob from '@/assets/signup/background-blob.svg';
import Dots from '@/assets/signup/dots.svg';

// Deps
import { ReactNode, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { Provider } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import * as Dialog from '@radix-ui/react-dialog';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Verifiers
const emailVerifier = z.string().email("Email isn't valid");
const passwordVerifier = z
  .string()
  .min(16, 'Password must be at least 16 characters');

export default function SignIn() {
  // Form email
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  // Form password
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // Form password
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Supabase
  const supabase = useSupabaseClient();

  // Router
  const router = useRouter();

  // Toastify
  const notifyOfError = (error: string) => toast.error(error);

  const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false);

  const validateEmail = useCallback(async () => {
    try {
      await emailVerifier.parseAsync(email);
      setEmailError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          setEmailError(issue.message);
        });
        return false;
      }
    }
    return true;
  }, [email]);

  const validatePassword = useCallback(() => {
    console.log(password, confirmPassword);

    try {
      passwordVerifier.parse(password.replaceAll(' ', ''));
      setPasswordError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          console.log(issue);
          switch (issue.code) {
            case 'too_small': {
              setPasswordError(issue.message);
            }
            case 'custom': {
              setConfirmPasswordError(issue.message);
            }
          }
        });
        return false;
      }
    }
    return true;
  }, [password, confirmPassword]);

  const validatePasswordsMatch = useCallback(() => {
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      return false;
    }
    setConfirmPasswordError('');
    return true;
  }, [password, confirmPassword]);

  useEffect(() => {
    validateEmail();
    validatePassword();
    validatePasswordsMatch();
  }, [
    email,
    password,
    validateEmail,
    validatePassword,
    validatePasswordsMatch,
  ]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const SignInWithOAuth = async (provider: Provider) => {
    const { error } = await supabase.auth.signInWithOAuth({ provider });

    if (error) {
      notifyOfError(error.message);
      return;
    }

    router.push('/');
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedToSubmit(true);

    console.log(password === confirmPassword);

    if (!validateEmail() || !validatePassword() || !validatePasswordsMatch())
      return;

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      notifyOfError(error.message);
      return;
    }

    router.push('/');
  };

  return (
    <>
      <ToastContainer />
      <div className='flex-row lg:flex'>
        <div className='flex flex-col items-center justify-around py-4 bg-background-main font-raleway lg:px-8 lg:grow lg:h-screen'>
          <div
            className='flex flex-col items-start w-full max-w-md gap-6 px-4'
            aria-label='welcome message'
          >
            <Image src={Brand} alt='brand identity' />
            <div className='flex flex-col gap-[14px]'>
              <h1 className='font-bold text-[32px] leading-[38px]'>
                Welcome back!
              </h1>
              <p className='font-medium text-gray-700 text-base leading-[19px]'>
                You can login to your account by using your mail and password
              </p>
            </div>
          </div>
          <Image
            src={Divider}
            alt='divider'
            aria-label='divider'
            className='py-4'
          />
          <form
            onSubmit={onSubmit}
            className='flex flex-col items-start w-full max-w-md gap-4 px-4'
            aria-label='login form'
          >
            <label className='flex flex-col w-full max-w-md' htmlFor='email'>
              <div className='flex flex-row items-center justify-between h-[18px]'>
                <span className='font-semibold text-[14px] leading-4'>
                  Email
                </span>
                {hasAttemptedToSubmit && emailError && (
                  <span className='text-[12px] font-normal text-red-400'>
                    {emailError}
                  </span>
                )}
              </div>
              <div className='flex flex-row border-[#DCE1EA] border-[1px] rounded-md p-4'>
                <input
                  type='text'
                  name='email'
                  id='email'
                  className='w-full text-gray-500 grow bg-background-main placeholder:text-gray-500'
                  value={email}
                  placeholder='Email'
                  onChange={onChange}
                />
                <Image
                  src={EmailImage}
                  alt='email svg'
                  aria-label='decorative'
                />
              </div>
            </label>
            <label className='flex flex-col w-full max-w-md' htmlFor='password'>
              <div className='flex flex-row items-center justify-between h-[18px]'>
                <span className='font-semibold text-[14px] leading-4'>
                  Password
                </span>
                {hasAttemptedToSubmit && passwordError && (
                  <span className='text-[12px] font-normal text-red-400'>
                    {passwordError}
                  </span>
                )}
              </div>
              <div className='flex flex-row border-[#DCE1EA] border-[1px] rounded-md p-4'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='password'
                  id='password'
                  className='w-full text-gray-500 grow bg-background-main placeholder:text-gray-500'
                  placeholder='Password'
                  value={password}
                  onChange={onChange}
                />
                <Image
                  src={EyeImage}
                  alt='email svg'
                  onClick={() => setShowPassword(!showPassword)}
                  className='cursor-pointer'
                  aria-label={showPassword ? 'hide password' : 'show password'}
                />
              </div>
            </label>
            <label
              className='flex flex-col w-full max-w-md'
              htmlFor='confirmPassword'
            >
              <div className='flex flex-row items-center justify-between h-[18px]'>
                <span className='font-semibold text-[14px] leading-4'>
                  Confirm Password
                </span>
                {hasAttemptedToSubmit && confirmPasswordError && (
                  <span className='text-[12px] font-normal text-red-400'>
                    {confirmPasswordError}
                  </span>
                )}
              </div>
              <div className='flex flex-row border-[#DCE1EA] border-[1px] rounded-md p-4'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  id='confirmPassword'
                  className='w-full text-gray-500 grow bg-background-main placeholder:text-gray-500'
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={onChange}
                />
                <Image
                  src={EyeImage}
                  alt='email svg'
                  onClick={() => setShowPassword(!showPassword)}
                  className='cursor-pointer'
                  aria-label={showPassword ? 'hide password' : 'show password'}
                />
              </div>
            </label>

            <button className='px-[14px] py-[16px] bg-green-dark w-full text-white rounded-md font-semibold text-base'>
              Sign up
            </button>
          </form>
          <Image
            src={Divider}
            alt='divider'
            aria-label='divider'
            className='py-4'
          />
          <div className='flex flex-col items-start w-full max-w-md gap-[32px] px-4'>
            <p className='self-center'>Or</p>
            <button
              className='flex flex-row items-center justify-center gap-6 px-[14px] py-[16px] bg-gray-200 w-full text-black rounded-md'
              onClick={() => SignInWithOAuth('google')}
            >
              <Image src={GoogleImage} alt='google svg' aria-label='google' />
              <span className='font-semibold text-base leading-[19px]'>
                Login with Google
              </span>
            </button>
            <p className='self-center font-medium text-black'>
              Already have an account?{' '}
              <Link className='text-[#DCB94A]' href='/signin'>
                Sign in
              </Link>
            </p>
          </div>
        </div>
        <div
          aria-label='illustrations'
          className='relative hidden w-full max-w-2xl xl:max-w-4xl 2xl:max-w-5xl bg-green-dark lg:flex'
        >
          <Image
            src={Mask}
            alt='Mask'
            className='absolute top-0 left-0 z-[1]'
          />
          <Image
            src={Mask}
            alt='Mask'
            className='absolute bottom-0 right-0 rotate-180 z-[1]'
          />
          <Image
            src={BackgroundBlob}
            alt='Background blob'
            className='absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-[1]'
          />
          <div className='absolute z-10 flex flex-col items-center justify-center text-white -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2'>
            <div aria-label='2 images' className='relative w-full h-[500px]'>
              <Image
                src={'/images/woman-chewing-pencil.jpg'}
                width={270}
                height={270}
                className='absolute top-[170px] left-0 z-30 shadow-signin-outline'
                alt='Woman chewing pencil'
              />
              <Image
                src={'/images/kid-doing-scratch.jpg'}
                width={270}
                height={270}
                className='absolute top-0 right-0 z-20 shadow-signin-outline'
                alt='Kid doing scratch'
              />
            </div>
            <div
              aria-label='content'
              className='flex flex-col items-center justify-center gap-4'
            >
              <h2 className='font-bold text-[26px] leading-[31px]'>
                Keep Record of Everything
              </h2>
              <p className='font-medium leading-[19px] text-base'>
                Lorem ipsum dolor sit amet consectetur. Lectus at enim tempus et
                felis a.
              </p>
              <Image src={Dots} alt='Dots...' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
