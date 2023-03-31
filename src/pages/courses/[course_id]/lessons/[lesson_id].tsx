import { useState, useEffect } from "react";
import { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { getCourseById, getLessonById, getLessonsInCourse } from "@/graphql/queries";
import { ILessonProps } from "@/global";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { supabase } from '@/utils/supabase-instance';
import { SupabaseHelper } from "@/utils/supabaseHelper";
import dynamic from "next/dynamic";
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const { lesson_id, course_id } = context.params;
  const lessonById = await getLessonById(lesson_id);
  const lessonsInCourse = await getLessonsInCourse(course_id);
  const User = await SupabaseHelper.getUserSessionFromContext(context);

  if(!User) {
    console.log("Not logged in")
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      }
    }
  }
  
  const courseById = await getCourseById(course_id);
  let whitelist = courseById.data.course.whitelist

  const getPermission = await supabase.from('purchased_courses').select(
    `*`
  ).eq('course_id', course_id).eq('user_id', User.id);

  if (getPermission?.data?.length || whitelist?.includes(User.email)) {
    return {
      props: {
        lesson_id: lesson_id,
        course_id: course_id,
        lesson: lessonById.data.lesson,
        lessonsInCourse: lessonsInCourse.data.course.lessonsCollection.items,
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

const Lesson: NextPage<ILessonProps> = (props): JSX.Element => {
  const lesson_id: string = props.lesson_id;
  const course_id: string = props.course_id;
  const lesson: any = props.lesson;
  const lessonsInCourse: any = props.lessonsInCourse;

  console.log("LESSON:", lesson);
  console.log("LESSONS:", lessonsInCourse);

  const lessonNumber = lessonsInCourse.findIndex((el: any) => {
    return el.sys.id == lesson_id
  })

  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>("");
  const [showNotes, setShowNotes] = useState<boolean>(false)

  const fetchComments = async () => {
    const response = await axios.get(`/api/comments?id=${lesson_id}`);
    setComments(response.data.data);
  }

  const addComment = async () => {
    const response = await axios.post(`/api/comments?id=${lesson_id}`, {
      id: lesson_id,
      comment,
    });
    fetchComments()
    setComment("")
  }

  const getDataTime = (data: string) => {
    const timestamp = Date.parse(data);
    const date = new Date(timestamp);
    const dateFormat = date.getHours() + ":" + date.getMinutes() + " " + date.toDateString();

    return dateFormat;
  }

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    console.log("COMMENTS:", comments);
  }, [comments]);

  return (
    <>
      <Head>
        <title>Lesson</title>
      </Head>

      <main className="container mx-auto py-20">
        <h2 className="mb-5 text-xl font-semibold text-[#6FC59B]">25% Completed</h2>

        <div className="grid grid-cols-12 gap-8">
          <section className="col-span-8">
            {/* Lesson */}
            <div>
              <div className="relative mb-5 pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-xl"
                  src={`https://embed.api.video/vod/${lesson.video.videoId}`}
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between gap-3.5 mb-4 font-medium text-[#94A0B4]">
                <span>{comments.length}</span>
                <span>Lesson {lessonNumber + 1} of {lessonsInCourse.length}</span>
              </div>

              <p className="mb-4">
                {documentToReactComponents(lesson?.description.json)}
              </p>
            </div>

            {/* Comments */}
            <div className="px-6 py-5 rounded-xl shadow-md">
              <button onClick={()=>{setShowNotes(!showNotes)}} className="bg-slate-400 p-2 shadow-lg rounded mb-5">Toggle Comments / Notes</button>
              {showNotes ? (
                <SunEditor />
              ) : (
                <>
                  <h2 className="mb-6 font-semibold">Comments</h2>
                  {comments.length > 0 ? (
                    <ul className="flex flex-col gap-5">
                      {
                        comments.map((el) => (
                          <li key={el.id} className="px-3 py-4 bg-[#F7F9FC]">
                            <h4 className="mb-2 text-sm font-medium">{el.user_id}</h4>
                            <p className="text-xs font-medium text-[#717E95]">{el.comment}</p>
                          </li>
                        ))
                      }
                    </ul>
                  ) : (
                    <p className="text-center text-xs font-medium text-[#717E95]">No comments</p>
                  )}
                </>
              )}
              
              


              <div className="flex items-center gap-4 mt-16 px-5 py-3.5 rounded-[10px] bg-[#F7F9FC]">
                <input
                  type="text"
                  className="w-full px-8 py-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your comment"
                />
                <button className="" onClick={addComment}>
                  <Image src="/images/send.png" width={40} height={40} alt="send" />
                </button>
              </div>
            </div>
          </section>

          {/* Lessons */}
          <section className="col-span-4 self-start">
            <div className="p-5 rounded-xl shadow-md">
              <h2 className="mb-7 font-semibold">{lesson.title}</h2>
              {lessonsInCourse?.map((el: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/courses/${course_id}/lessons/${el.sys.id}`}
                  className="flex items-start gap-3 my-2 px-2 py-3"
                >
                  <Image className="rounded-md" src={el.coverPicture.url ?? "/images/placeholder.png"} width={80} height={70} alt={el.title} />
                  <div>
                    <h4 className="mb-1 text-xs font-semibold">{el.title}</h4>
                    <p>
                      <span className="text-xs text-[#5B667A]">Leo Mango</span> - <span className="text-xs text-[#94A0B4]">35 Mins</span>
                    </p>
                  </div>
                  <Image className="ml-auto" src="/images/check.png" width={18} height={18} alt="check" />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Lesson;
