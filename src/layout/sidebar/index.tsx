import Image from 'next/image';
import Link from 'next/link';
import Router from 'next/router';
import sidebarItems from './sidebarItems';
import SidebarIcons from './SidebarIcons';

import Brand from '@/assets/brand.svg';
import Line from '@/assets/signup/line.svg';

import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { CrossCircledIcon } from '@radix-ui/react-icons';

import { useState } from 'react';
import Switch from '@/components/common/Switch';
import clsx from 'clsx';

const NavItems = [
  {
    icon: 'home',
    activeIcon: 'home-filled',
    name: 'home',
    title: 'Home',
    url: '/',
  },
  {
    icon: 'explore',
    activeIcon: 'explore-filled',
    name: 'explore',
    title: 'Explore Courses',
    url: '/courses',
  },
  {
    icon: 'course-lesson',
    activeIcon: 'course-lesson-filled',
    name: 'course-lesson',
    title: 'My Courses',
    url: '/mycourses',
  },
  {
    icon: 'instructor',
    activeIcon: 'instructor-filled',
    name: 'instructor',
    title: 'My Instructors',
    url: '/instructors',
  },
  {
    icon: 'video',
    activeIcon: 'video-filled',
    name: 'video',
    title: 'My Meetings',
    url: '/MyMeetings',
  },
  {
    icon: 'explore',
    activeIcon: 'explore-filled',
    name: 'explore ',
    title: 'Marathon',
    url: '/Marathon',
  },
] as const;

export type NavItem = typeof NavItems[number]['title'];

const Sidebar = ({ title }: { title: NavItem }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <nav className='md:w-[300px] whitespace-nowrap h-screen py-12 bg-gradient-to-r from-gray-100 to-white'>
      <div className='absolute transition-all duration-300 ease-in-out md:hidden top-10 left-5 '>
        {isSidebarOpen ? (
          <div className='fixed top-0 bottom-0 left-0 z-50 w-5/6 h-screen bg-slate-200'>
            <CrossCircledIcon
              className='absolute cursor-pointer top-10 left-5'
              onClick={() => {
                setIsSidebarOpen(false);
              }}
            />
          </div>
        ) : (
          <HamburgerMenuIcon
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          />
        )}
      </div>
      <div className='hidden w-full h-full gap-4 md:flex md:flex-col md:items-center md:justify-start'>
        <div className='flex flex-col items-center justify-start gap-13'>
          <Image src={Brand} alt='Brand' width={180} height={48} />
          <Image
            src={Line}
            alt='seperator'
            width={274}
            className='opacity-50'
          />
        </div>
        <ul className='flex flex-col w-full'>
          {NavItems.map((item) => (
            <Link
              href={item.url}
              key={item.title}
              className={clsx(
                'flex flex-row gap-4 items-center font-bold text-base leading-[19px] py-4 px-12 w-full text-center group overflow-hidden relative',
                item.title === title
                  ? 'text-green-dark after-effect'
                  : 'text-gray-400',
              )}
            >
              <SidebarIcons
                iconName={item.title === title ? item.activeIcon : item.icon}
                width={21}
                height={21}
              />
              {item.title === title ? (
                <span className='text-teal-500 transition-all duration-300 ease-in-out group-hover:text-teal-700'>
                  {item.title}
                </span>
              ) : (
                <span className='text-gray-400 transition-all duration-300 ease-in-out group-hover:text-gray-500'>
                  {item.title}
                </span>
              )}
            </Link>
          ))}
        </ul>
        <div
          className='mt-auto'
          onClick={() => {
            setTheme((currentTheme) =>
              currentTheme === 'dark' ? 'light' : 'dark',
            );
          }}
        >
          <Switch theme={theme} />
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
