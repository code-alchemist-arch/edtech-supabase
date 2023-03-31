import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';
import { ICourse, ICourses } from '@/global';
import { getCourseCollections } from '@/graphql/queries';
import Course from '@/components/courses/Course';
import { UserComponent } from '@/components/common/UserComponent';

const PurchasedIds = [
  "6FITpYataoSkwiUhOLEG6L",
  "6INMIRA9oG6hIfNN9I7btT",
  "3OD78Cw556LnipBf2ZGT9a",
  "6ZV5TuwWtpgmEFkISkd0Yj",
]

const MyCourses: NextPage<ICourses> = ({ allCourses }): JSX.Element => {
  const purchasedCollection = allCourses?.filter((item: ICourse) => {
    return PurchasedIds.includes(item.sys.id);
  });

  return (
    <div className='p-8 pl-[306px] bg-background-light'>
      <div className='flex justify-end'>
        <UserComponent email='jhondoe@gmail.com' />
      </div>
      <div className='flex items-end justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>My Courses</h2>
          <p>
            Loirem engineering cengin eeri ng cont ributious to significa ntlyLoirem engineering cengin eeri ng cont ributious to significa ntly
          </p>
        </div>
        <Link className='p-2 text-white bg-black-base' href="/courses">Explore courses</Link>
      </div>
      <div className='grid grid-cols-4 gap-3.5 mt-7 bg-white'>
        {purchasedCollection.map((item: ICourse) => (
          <Course
            key={item.sys.id}
            price={item.price}
            title={item.title}
            description={item.description}
            lessonsCollection={item.lessonsCollection}
            instructor={item.instructor}
            sys={item.sys}
            previewVideo={item.previewVideo}
          />
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const content = await getCourseCollections();

  return {
    props: {
      allCourses: content.data.courseCollection.items,
    },
  };
};

export default MyCourses;
