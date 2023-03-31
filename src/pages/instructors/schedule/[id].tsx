import { type NextPage, type GetServerSideProps } from 'next';
import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { IInstructors, IInstructor } from '@/global';
import { getInstructorCollections } from '@/graphql/queries';
import Layout from '@/layout';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Instructors: NextPage<IInstructors> = ({ data }): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id);

  return (
    <Layout title={'My Instructors'}>
      <div className='md:px-[40px] px-[20px] w-full h-auto py-4'>
        <h1>Schedule with {id}</h1>
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
