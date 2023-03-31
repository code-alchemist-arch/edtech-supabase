import Image from 'next/image';
import React, { Dispatch, SetStateAction, useState } from 'react';
import FilterIcon from '@/assets/filter.svg';

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
    <form onSubmit={handleSubmit} className='flex'>
      <input
        type='text'
        placeholder='Search here'
        className='mr-2 p-2 border-none w-[360px]'
        value={searchVal}
        onChange={(e) => setSearchVal(e.target.value)}
      />
      <button type='submit' className='bg-white rounded-md'>
        <Image src={FilterIcon} alt='filter' width={40} height={40} />
      </button>
    </form>
  );
};
