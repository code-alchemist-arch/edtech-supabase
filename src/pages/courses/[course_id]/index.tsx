import { NextPage, GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { getCourseById } from "@/graphql/queries";
import { ICourse, ICourseProps } from "@/global";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Comments from "@/components/comments";
import { supabase } from '@/utils/supabase-instance';
import { SupabaseHelper } from "@/utils/supabaseHelper";

 
export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { course_id } = context.params as any;
  const User = await SupabaseHelper.getUserSessionFromContext(context)
  if(!User) {
    console.log("Not logged in")
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      }
    }
  }

  const getPermission = await supabase.from('purchased_courses').select(
    `*`
  ).eq('course_id', course_id).eq('user_id', User.id);

  const courseById = await getCourseById(course_id);
  let whitelist = courseById.data.course.whitelist
  
  if (getPermission?.data?.length || whitelist?.includes(User.email)) {
    return {
      props: {
        course_id: course_id,
        course: courseById.data.course,
        lessonsInCourse: courseById.data.course.lessonsCollection.items,
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/403",
      }
    }
  }
};

const Course: NextPage<ICourseProps> = (props): JSX.Element => {
  const router = useRouter();
  const course_id: string = props.course_id;
  const course: ICourse = props.course;
  const lessonsInCourse: any = props.lessonsInCourse;

  return (
    <>
      <Head>
        <title>Course</title>
      </Head>

      <main className="container mx-auto py-20">
        <h1>{course?.title}</h1>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-7">
            {/* Course */}
            <div>
              <div className="relative pt-[56.25%]">
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={course?.previewVideo?.assets?.player}
                    allowFullScreen
                  />
              </div>
              {documentToReactComponents(course?.description.json)}
            </div>

            {/* Comments */}
            <Comments id={course_id} />
          </section>

          {/* Lessons */}
          <section className="col-span-5 self-start p-2 bg-gray-200">
            <h2>Lessons</h2>
            {lessonsInCourse?.map((el: any, idx: number) => (
              <Link
                key={idx}
                href={`/courses/${course_id}/lessons/${el.sys.id}`}
                className="flex gap-4 my-2 p-2 bg-gray-400"
              >
                <Image className="self-start" src={el.coverPicture.url ?? "/images/placeholder.png"} width={80} height={70} alt={el.title} />
                <h3>{el.title}</h3>
              </Link>
            ))}
          </section>
        </div>
      </main>
    </>
  );
};

export default Course;
