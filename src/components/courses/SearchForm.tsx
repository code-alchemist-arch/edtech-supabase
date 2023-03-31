import Image from 'next/image';
import React, { Dispatch, SetStateAction } from 'react';
import ZoomIcon from '@/assets/zoom_icon.svg';

type propTypes = {
  handleSubmit: (e: React.SyntheticEvent) => void;
  searchVal: string;
  setSearchVal: Dispatch<SetStateAction<string>>;
};

export const SearchForm = ({
  handleSubmit,
  searchVal,
  setSearchVal,
}: propTypes) => {
  return (
    <form onSubmit={handleSubmit} className='relative text-center'>
      <input
        type='text'
        placeholder='Search'
        className='w-full h-10 rounded-lg py-2.5 px-5 border border-grey-500'
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <button type='submit' className='bg-transparent w-full h-full rounded-md absolute top-[50%] translate-y-[-50%] translate-x-[-30px]'>
        <Image src={ZoomIcon} alt='filter' />
      </button>
    </form>
  );
};
