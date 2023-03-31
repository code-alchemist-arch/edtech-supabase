import React, { useState } from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { IInstructor } from '@/global';

const Instructor: NextPage<IInstructor> = ({ name, email, picture, id }) => {
  return (
    <div className='flex flex-col'>
      <div className='relative flex flex-col text-center items-center p-5 cursor-pointer bg-white rounded-md'>
        <div className='relative p-2 w-20 h-20'>
          <Image
            src={picture.url}
            alt='instructor'
            fill
            className='rounded-[50%]'
          />
        </div>
        <span className='font-bold'>{name}</span>
        <span className='text-grey-dark'>{email}</span>
        <Link
          href={`instructors/schedule/${name}`}
          className='bg-background-light p-2.5 rounded-md mt-2.5'
        >
          Schedule meeting
        </Link>
      </div>
    </div>
  );
};

export default Instructor;
