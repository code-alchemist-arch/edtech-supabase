import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id?: string | string[];
  error: boolean;
  data: null | Array<object>;
  error_message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });
  const {data} = await supabaseServerClient.auth.getUser();
  if (!data.user) {
    return res
    .status(500)
    .json({
      error: true,
      error_message: "Unauthorized",
      data: null,
    });
  };
  console.log(data.user);
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(500).json({
        error: true,
        id: "",
        data: null,
        error_message: "please provide id",
      });
    }
    const { data } = await supabaseServerClient
      .from("comments")
      .select("*")
      .eq("lesson_id", id);
    if (!data) {
      return res.status(404).json({
        error: true,
        id,
        data: null,
        error_message: "Lesson not found",
      });
    }
    return res.status(200).json({ error: false, id: id, data: data });
  } else if (req.method === "POST") {
    const { id, comment } = req.body;

    if (id.length < 1) {
      return res
        .status(500)
        .json({
          error: true,
          error_message: "enter a valid id",
          data: null,
        });
    }

    if (comment.length < 1) {
      return res
        .status(500)
        .json({
          error: true,
          error_message: "enter a comment",
          data: null,
        });
    }
    const user = await supabaseServerClient.auth.getUser();
    if (user.error) {
      return res
        .status(403)
        .json({
          error: true,
          data: null,
          error_message: "unauthorized",
        });
    }
    const comment_data = await supabaseServerClient
      .from("comments")
      .insert({ lesson_id: id, comment, user_id: data.user.id })
      .select();
    if (comment_data.error) {
      return res
        .status(500)
        .json({
          error: true,
          error_message: "Supabase error",
          data: null,
        });
    }
    res
      .status(200)
      .json({ error: false, data: null });
  }
}
