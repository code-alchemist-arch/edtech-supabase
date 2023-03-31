import { type NextPage, type GetServerSideProps } from 'next';
import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { IInstructors, IInstructor } from '@/global';
import { getInstructorCollections } from '@/graphql/queries';
import Layout from '@/layout';
import Image from 'next/image';
import Link from 'next/link';

const Instructors: NextPage<IInstructors> = ({ data }): JSX.Element => {
  const [filter, setFilter] = useState<string>('');

  const handleFilter = (new_value: string) => {
    setFilter(new_value);
  };

  const debouncedChangeHandler = useMemo(() => debounce(handleFilter, 300), []);

  const filteredCollection = data.instructorCollection.items.filter(
    (item: IInstructor) => {
      return item.name.toLowerCase().includes(filter.toLowerCase());
    },
  );

  return (
    <Layout title={'My Instructors'}>
      <div className='md:px-[40px] px-[20px] w-full h-auto py-4'>
        <div className='flex w-full'>
          <label
            htmlFor='search'
            className='flex flex-row justify-between w-full max-w-[330px] rounded-md border-[#DCE1EA] border-[1px] px-4 py-[18px] cursor-text'
          >
            <input
              type='text'
              className='text-base font-medium text-gray-500 leading-[19px] grow'
              placeholder='Search'
              name='search'
              id='search'
              onChange={(event) => {
                debouncedChangeHandler(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleFilter(event.currentTarget.value);
                }
              }}
            />
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M19.7555 18.6065L16.3182 15.2458L16.2376 15.1233C16.0878 14.9742 15.883 14.8902 15.6692 14.8902C15.4554 14.8902 15.2505 14.9742 15.1007 15.1233C12.1795 17.8033 7.67815 17.949 4.58201 15.4637C1.48586 12.9784 0.755668 8.63337 2.87568 5.31017C4.9957 1.98697 9.30807 0.716847 12.9528 2.34214C16.5976 3.96743 18.4438 7.98379 17.267 11.7276C17.1823 11.9981 17.2515 12.2922 17.4487 12.4992C17.6459 12.7062 17.9411 12.7946 18.223 12.7311C18.505 12.6676 18.7309 12.4619 18.8156 12.1914C20.2224 7.74864 18.0977 2.96755 13.8161 0.941058C9.53449 -1.08544 4.38084 0.250824 1.68905 4.08542C-1.00273 7.92001 -0.424821 13.1021 3.04893 16.2795C6.52268 19.4569 11.8498 19.6759 15.5841 16.7949L18.6277 19.7705C18.942 20.0765 19.4502 20.0765 19.7645 19.7705C20.0785 19.4602 20.0785 18.9606 19.7645 18.6503L19.7555 18.6065Z'
                fill='#94A0B4'
              />
            </svg>
          </label>
        </div>
        <div className='grid min-[2200px]:grid-cols-6 grid-cols max-[560px]:grid-cols-1 max-[760px]:grid-cols-2 min-[820px]:grid-cols-2 min-[1168px]:grid-cols-3 min-[1420px]:grid-cols-4 min-[1728px]:grid-cols-5 mt-7 '>
          {filteredCollection.map((item: IInstructor) => (
            <div
              key={item.email}
              className='shadow-instructor-card border-[1px] border-[#DCE1EA] rounded-[10px] w-[251px] h-[250px] my-5 flex flex-col items-center justify-between py-[22px]'
            >
              <div className='relative w-[80px] h-[80px] rounded-full border-2 border-green-dark max-w-[219px]'>
                <Image
                  src={item.picture.url ?? '/images/avatar.jpg'}
                  alt='instructor'
                  width={74}
                  height={74}
                  className='absolute transform -translate-x-1/2 -translate-y-1/2 rounded-full left-1/2 top-1/2 border-[1px] border-transparent w-[74px] h-[74px]'
                  quality={100}
                />
              </div>
              <div className='max-w-[219px] flex items-center flex-col gap-2'>
                <h3 className='text-base font-medium leading-[19px]'>
                  {item.name}
                </h3>
                <p className='text-gray-500 leading-[14px] font-normal'>
                  {item.email}
                </p>
              </div>
              <Link
                href={`/instructors/schedule/${item.name}`}
                className='max-w-[219px] rounded-md bg-green-dark text-white py-[14px] px-[16px] w-full text-center'
              >
                Schedule Meeting
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await getInstructorCollections();
  return {
    props: {
      data: content.data,
    },
  };
};

export default Instructors;
