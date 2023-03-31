import { CONTENTFUL_ACCESS_TOKEN } from "@/constants/main";
import { IContentfulSys } from "@/global";
import { supabaseAdmin } from "@/utils/supabase-instance";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error: boolean;
  status: "completed" | "not completed" | "updated" | "deleted";
  reason?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const access_token = req.headers["access-token"];
  if (access_token !== CONTENTFUL_ACCESS_TOKEN) {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "unauthorized",
    });
  }
  if (req.method === "POST") {
    const sys: IContentfulSys = req.body.sys;
    const { error } = await supabaseAdmin
      .from("product")
      .delete()
      .eq("course_id", sys.id);
    if (error) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "Supabase error in deleting | No database record found",
      });
    }
    return res.status(200).json({
      error: false,
      status: "deleted",
    });
  }else {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "Invalid Request Type",
    });
  }
};