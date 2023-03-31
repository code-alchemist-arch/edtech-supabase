import { createPersistedQueryLink } from "@apollo/link-persisted-queries";
import { ApolloClient, InMemoryCache, from, HttpLink } from "@apollo/client";
import { getCourseCollectionQuery, getLessonByIdQuery, getLessonsInCourseQuery, getCourseByIdQuery, getInstructorCollectionQuery } from "../gql";

const TOKEN = process.env.CONTENT_API_KEY;
const SPACE = process.env.CONTENT_SPACE_ID;

const URL = `https://graphql.contentful.com/content/v1/spaces/${SPACE}`;

const link = from([
  createPersistedQueryLink(),
  new HttpLink({
    uri: URL,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }),
]);

const cache = new InMemoryCache();
const apolloClient = new ApolloClient({
  link,
  cache,
});

export const getCourseCollections = () => {
  return apolloClient.query({
    query: getCourseCollectionQuery,
  });
}

export const getInstructorCollections = () => {
  return apolloClient.query({
    query: getInstructorCollectionQuery,
  });
}

export const getLessonById = (lesson_id: string) => {
  return apolloClient.query({
    query: getLessonByIdQuery,
    variables: {
      lesson_id: lesson_id,
    },
  });
}

export const getCourseById = (course_id: string) => {
  return apolloClient.query({
    query: getCourseByIdQuery,
    variables: {
      course_id: course_id,
    }
  })
}

export const getLessonsInCourse = (course_id: string) => {
  return apolloClient.query({
    query: getLessonsInCourseQuery,
    variables: {
      course_id: course_id,
    },
  });
}
