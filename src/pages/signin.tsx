// Images
import EmailImage from '@/assets/signup/email.svg';
import EyeImage from '@/assets/signup/eye.svg';
import Brand from '@/assets/brand.svg';
import Divider from '@/assets/signup/line.svg';
import GoogleImage from '@/assets/signup/google.svg';
import Mask from '@/assets/signup/mask.svg';
import BackgroundBlob from '@/assets/signup/background-blob.svg';
import Dots from '@/assets/signup/dots.svg';

import { Cross2Icon } from '@radix-ui/react-icons';

// Deps
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { z } from 'zod';
import { type Provider } from '@supabase/supabase-js';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import * as Dialog from '@radix-ui/react-dialog';
import OtpInput from 'react-otp-input';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const emailVerifier = z.string().email("Email isn't valid");
const passwordVerifier = z.string().min(16, {
  message: 'Must be 16 or more characters',
});

// Components
function OTPModal({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<
    'get_email' | 'sent_otp' | 'change_password'
  >('get_email');

  const [otp, setOtp] = useState('');

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  // Change Password Form
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false);
  const [
    hasAttemptedToSubmitPasswordChange,
    setHasAttemptedToSubmitPasswordChange,
  ] = useState(false);

  const supabase = useSupabaseClient();

  const validateEmail = useCallback(() => {
    try {
      emailVerifier.parse(email);
      setEmailError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
        error.issues.forEach((issue) => {
          setEmailError(issue.message);
        });
        return false;
      }
    }
    return true;
  }, [email]);

  const validateNewPassword = useCallback(() => {
    try {
      passwordVerifier.parse(newPassword.replaceAll(' ', ''));
      setNewPasswordError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          setNewPasswordError(issue.message);
        });
        return false;
      }
    }
    return true;
  }, [newPassword]);

  useEffect(() => {
    validateEmail();
    validateNewPassword();

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
    } else {
      setConfirmPasswordError('');
    }
  }, [email, validateEmail, validateNewPassword, newPassword, confirmPassword]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'newPassword':
        setNewPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const submitHandlerEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    e.stopPropagation(); // Prevents the outer form from submitting since this is a nested form

    setHasAttemptedToSubmit(true);

    if (!validateEmail()) return;

    // Send OTP
    // ...

    toast.success('OTP sent to your email');
    // Change modal page to OTP page
    setStatus('sent_otp');
  };

  const submitHandlerOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    e.stopPropagation(); // Prevents the outer form from submitting since this is a nested form

    if (otp.length !== 4) {
      toast.error('Invalid OTP, must be 4 digits');
      return;
    }

    // Verify OTP
    // ...
    // if (error) toast.error(error.message) && return

    console.log(otp);
    setStatus('change_password');
  };

  const submitHandlerPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the page from refreshing
    e.stopPropagation(); // Prevents the outer form from submitting since this is a nested form

    setHasAttemptedToSubmitPasswordChange(true);

    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
      return;
    }

    if (!validateNewPassword() && newPassword !== confirmPassword) return;

    // Change password with otp which is still saved
    // ...
    // if (error) toast.error(error.message) && return
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0' />
        <Dialog.Content className='data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[60vh] w-full max-w-[85vw] sm:max-w-[75vw] md:max-w-[65vw] xl:max-w-[35vw] h-full translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none z-50 flex flex-col gap-[76px] items-center justify-center'>
          {status === 'get_email' && (
            <>
              <div className='flex flex-col gap-[14px] items-center justify-center'>
                <Dialog.Title className='font-bold text-[32px] leading-[38px]'>
                  Forgot your password?
                </Dialog.Title>
                <Dialog.Description className='text-base font-medium text-gray-700 leading-[19px]'>
                  You can recover your password from your mail
                </Dialog.Description>
              </div>
              <form
                onSubmit={submitHandlerEmail}
                className='flex flex-col items-start w-full max-w-md gap-4'
                id='email-form'
              >
                <label
                  className='flex flex-col w-full max-w-md pointer-events-auto'
                  htmlFor='email-otp'
                >
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
              </form>

              <button
                form='email-form'
                className='px-[14px] py-[16px] bg-green-dark text-white rounded-md font-semibold text-base leading-[19px] w-full max-w-md'
              >
                Verify Mail
              </button>
              <Dialog.Close asChild>
                <button
                  className='text-green-dark hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
                  aria-label='Close'
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </>
          )}
          {status === 'sent_otp' && (
            <>
              <div className='flex flex-col gap-[14px] items-center justify-center'>
                <Dialog.Title className='font-bold text-[32px] leading-[38px]'>
                  One Time Password
                </Dialog.Title>
                <Dialog.Description className='text-base font-medium text-gray-700 leading-[19px] max-w-[60ch] text-center'>
                  You will receive one time password for verification on{' '}
                  <span className='text-green-dark'>{email}</span>
                </Dialog.Description>
              </div>
              <form
                onSubmit={submitHandlerOTP}
                className='flex flex-row items-center justify-center w-full max-w-md gap-16'
                id='otp-verify'
              >
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={4}
                  renderSeparator={
                    <span className='px-[12px] xl:px-[18px]'></span>
                  }
                  shouldAutoFocus
                  renderInput={(props, index) => (
                    <label
                      htmlFor={`input-${index}`}
                      className='max-w-[75px] w-full border-[1px] border-[#FFCB2F] rounded-md px-[15px] py-[10px] sm:px-[32px] sm:py-[27px]'
                    >
                      <input
                        {...props}
                        id={`input-${index}`}
                        className='w-full'
                      />
                    </label>
                  )}
                  containerStyle={'flex flex-row'}
                />
              </form>
              <p className='text-base font-medium leading-[19px]'>
                Didn&apos;t receive the password?{' '}
                <span className='text-[#EB5757]'>Retry in 0:09</span>
              </p>

              <button
                form='otp-verify'
                className='px-[14px] py-[16px] bg-green-dark text-white rounded-md font-semibold text-base leading-[19px] w-full max-w-md'
              >
                Verify OTP
              </button>
              <Dialog.Close asChild>
                <button
                  className='text-green-dark hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
                  aria-label='Close'
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </>
          )}
          {status === 'change_password' && (
            <>
              <div className='flex flex-col gap-[14px] items-center justify-center'>
                <Dialog.Title className='font-bold text-[32px] leading-[38px]'>
                  Change Password
                </Dialog.Title>
                <Dialog.Description className='text-base font-medium text-gray-700 leading-[19px]'>
                  You can set a new password to your account
                </Dialog.Description>
              </div>
              <form
                onSubmit={submitHandlerPassword}
                className='flex flex-col items-start w-full max-w-md gap-[30px]'
                id='change-password'
              >
                <label
                  className='flex flex-col w-full max-w-md pointer-events-auto'
                  htmlFor='email-otp'
                >
                  <div className='flex flex-row items-center justify-between h-[18px]'>
                    <span className='font-semibold text-[14px] leading-4'>
                      Password
                    </span>
                    {hasAttemptedToSubmitPasswordChange && newPasswordError && (
                      <span className='text-[12px] font-normal text-red-400'>
                        {newPasswordError}
                      </span>
                    )}
                  </div>
                  <div className='flex flex-row border-[#DCE1EA] border-[1px] rounded-md p-4'>
                    <input
                      type='text'
                      name='newPassword'
                      id='newPassword'
                      className='w-full text-gray-500 grow bg-background-main placeholder:text-gray-500'
                      value={newPassword}
                      placeholder='Password'
                      onChange={onChange}
                    />
                    <Image
                      src={EyeImage}
                      alt='eye svg'
                      aria-label='decorative'
                    />
                  </div>
                </label>
                <label
                  className='flex flex-col w-full max-w-md pointer-events-auto'
                  htmlFor='email-otp'
                >
                  <div className='flex flex-row items-center justify-between h-[18px]'>
                    <span className='font-semibold text-[14px] leading-4'>
                      Confirm Password
                    </span>
                    {hasAttemptedToSubmitPasswordChange &&
                      confirmPasswordError && (
                        <span className='text-[12px] font-normal text-red-400'>
                          {confirmPasswordError}
                        </span>
                      )}
                  </div>
                  <div className='flex flex-row border-[#DCE1EA] border-[1px] rounded-md p-4'>
                    <input
                      type='text'
                      name='confirmPassword'
                      id='confirmPassword'
                      className='w-full text-gray-500 grow bg-background-main placeholder:text-gray-500'
                      value={confirmPassword}
                      placeholder='Confirm password'
                      onChange={onChange}
                    />
                    <Image
                      src={EyeImage}
                      alt='eye svg'
                      aria-label='decorative'
                    />
                  </div>
                </label>
              </form>

              <button
                form='change-password'
                className='px-[14px] py-[16px] bg-green-dark text-white rounded-md font-semibold text-base leading-[19px] w-full max-w-md'
              >
                Change Password
              </button>
              <Dialog.Close asChild>
                <button
                  className='text-green-dark hover:bg-violet4 focus:shadow-violet7 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
                  aria-label='Close'
                >
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function SignIn() {
  // Form email
  const [email, setEmail] = useState('');
  const emailRef = useRef<HTMLInputElement>(null);
  const [emailError, setEmailError] = useState('');
  // Form password
  const [password, setPassword] = useState('');
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  // Form checkbox
  const [checked, setChecked] = useState(false);
  const checkedRef = useRef<HTMLInputElement>(null);

  // Supabase
  const supabase = useSupabaseClient();

  // Router
  const router = useRouter();

  // Toastify
  const notifyOfError = (error: string) => toast.error(error);

  const [hasAttemptedToSubmit, setHasAttemptedToSubmit] = useState(false);

  const validateEmail = useCallback(() => {
    try {
      emailVerifier.parse(email);
      setEmailError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.issues);
        error.issues.forEach((issue) => {
          setEmailError(issue.message);
        });
        return false;
      }
    }
    return true;
  }, [email]);

  const validatePassword = useCallback(() => {
    try {
      passwordVerifier.parse(password.replaceAll(' ', ''));
      setPasswordError('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          setPasswordError(issue.message);
        });
        return false;
      }
    }
    return true;
  }, [password]);

  useEffect(() => {
    validateEmail();
    validatePassword();
  }, [email, password, validateEmail, validatePassword]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setEmail(e.target.value);
        break;
      case 'password':
        setPassword(e.target.value);
        break;
      case 'checked':
        setChecked(e.target.checked);
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

    // To get "Remember me" checkbox value:
    // const Form = new FormData(e.currentTarget);
    // const checked = Form.get('checked') ?? false;

    if (!validateEmail() || !validatePassword()) return;

    const { data: userData, error } = await supabase.auth.signInWithPassword({
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
          <Image src={Divider} alt='divider' aria-label='divider' />
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
                  ref={emailRef}
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
                  ref={passwordRef}
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
            <div className='flex flex-row justify-between w-full max-w-md'>
              <label
                htmlFor='checkbox'
                className='flex flex-row justify-between cursor-pointer'
              >
                <input
                  className='hidden'
                  type='checkbox'
                  width={24}
                  height={24}
                  name='checked'
                  id='checkbox'
                  checked={checked}
                  onChange={onChange}
                  ref={checkedRef}
                />
                <svg
                  height={24}
                  width={24}
                  className='rounded-md border-[1px] border-gray-200 m-0 p-0 inline-block'
                >
                  <path d='M0 0h24v24H0z' fill={checked ? 'green' : 'gray'} />
                  <path
                    d='M9 16.2L4.8 12l-1.4 1.4 6 6 10-10L18.6 9z'
                    fill={checked ? 'white' : 'gray'}
                  />
                </svg>
                <span className='ml-2 text-[14px]'>Remember me</span>
              </label>
              <OTPModal>
                <button className='text-[#EB5757] cursor-pointer text-[12px]'>
                  Forgot password?
                </button>
              </OTPModal>
            </div>

            <button className='px-[14px] py-[16px] bg-green-dark w-full text-white rounded-md font-semibold text-base'>
              Login
            </button>
          </form>
          <Image src={Divider} alt='divider' aria-label='divider' />
          <div className='flex flex-col items-start w-full max-w-md gap-[38px] px-4'>
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
              Don&apos;t have an account?{' '}
              <Link className='text-[#DCB94A]' href='/signup'>
                Sign up
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
                className='absolute top-[170px] left-0 z-20 shadow-signin-outline'
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
