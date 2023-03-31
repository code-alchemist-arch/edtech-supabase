import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import { type NavItem } from './sidebar';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { type ReactNode, useState } from 'react';

const DropdownMenuSettings = ({ children }: { children: ReactNode }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade'
          sideOffset={5}
        >
          <DropdownMenu.Item className='group text-[13px] leading-none text-black rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none outline-none'>
            User Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator className='h-[1px] bg-violet6 m-[5px]' />
          <DropdownMenu.Item className='group text-[13px] leading-none text-green-dark rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none data-[highlighted]:bg-green-dark data-[highlighted]:text-violet1 outline-none'>
            Change your avatar
          </DropdownMenu.Item>
          <DropdownMenu.Item className='group text-[13px] leading-none text-green-dark rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none data-[highlighted]:bg-green-dark data-[highlighted]:text-violet1 outline-none'>
            Do something cool?
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const DropdownMenuNotifications = ({ children }: { children: ReactNode }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[220px] bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade'
          sideOffset={5}
        >
          <DropdownMenu.Item className='group text-[13px] leading-none text-black rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none data- outline-none'>
            Notifications
          </DropdownMenu.Item>
          <DropdownMenu.Separator className='h-[1px] bg-violet6 m-[5px]' />
          <DropdownMenu.Item className='group text-[13px] leading-none text-green-dark rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none data-[highlighted]:bg-green-dark data-[highlighted]:text-violet1 outline-none'>
            You were born?
          </DropdownMenu.Item>
          <DropdownMenu.Item className='group text-[13px] leading-none text-green-dark rounded-[3px] flex items-center h-[25px] px-[5px] relative pl-[25px] select-none data-[highlighted]:bg-green-dark data-[highlighted]:text-violet1 outline-none'>
            You have a birthday?
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

const Header = ({ title }: { title: NavItem }) => {
  return (
    <header className='flex flex-col gap-4 md:px-[40px] px-[20px]'>
      <div className='flex justify-between pt-[60px]'>
        <h1 className='font-semibold text-xl sm:text-[24px] md:text-[28px] leading-[33px]'>
          {title}
        </h1>
        <div className='flex items-center justify-start gap-4'>
          <DropdownMenuNotifications>
            <Image
              src={'/icons/notification2.png'}
              alt='Notification bell'
              width={24}
              height={24}
              className='cursor-pointer'
            />
          </DropdownMenuNotifications>
          <div className='hidden md:block'>
            <DropdownMenuSettings>
              <div className='flex items-center gap-4 cursor-pointer'>
                <p>johndoe@gmail.com</p>
                <div>
                  <svg
                    width='16'
                    height='10'
                    viewBox='0 0 16 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='w-full h-full p-2'
                  >
                    <path
                      d='M0.46967 0.96967C0.735936 0.703403 1.1526 0.679197 1.44621 0.897052L1.53033 0.96967L8 7.439L14.4697 0.96967C14.7359 0.703403 15.1526 0.679197 15.4462 0.897052L15.5303 0.96967C15.7966 1.23594 15.8208 1.6526 15.6029 1.94621L15.5303 2.03033L8.53033 9.03033C8.26406 9.2966 7.8474 9.3208 7.55379 9.10295L7.46967 9.03033L0.46967 2.03033C0.176777 1.73744 0.176777 1.26256 0.46967 0.96967Z'
                      fill='#94A0B4'
                    />
                  </svg>
                </div>
              </div>
            </DropdownMenuSettings>
          </div>
        </div>
      </div>
      <div>
        <p className='text-base font-normal leading-[19px] line'>
          Lorem ipsum dolor sit amet consectetur. Mi pharetra tellus quis semper
          tincidunt cras.
        </p>
      </div>
    </header>
  );
};

export default Header;
