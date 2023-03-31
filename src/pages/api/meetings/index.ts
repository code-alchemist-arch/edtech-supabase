import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/utils/supabase-instance";
import { IBody } from "@/global";
import {
  addMinutes,
  createZoomMeeting,
  deleteZoomMeeting,
  GenerateZoomAdminData,
  UpdateZoomMeeting,
} from "@/utils/helper";

type Data = {
  meetingLink: string | null;
  error: boolean;
  status: "completed" | "not completed" | "deleted";
  reason?: string;
};
// IBody is how you define the req.body and provide meeting_id as a query param in delete and patch request

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const supabaseServerClient = createServerSupabaseClient({
    req,
    res,
  });
  const { data } = await supabaseServerClient.auth.getUser();
  if (!data.user) {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "Unauthorized",
      meetingLink: null,
    });
  }
  const zoom_admin_data = await GenerateZoomAdminData();
  if (!zoom_admin_data) {
    return res.status(500).json({
      error: true,
      reason: "Zoom Error",
      meetingLink: null,
      status: "not completed",
    });
  }
  if (req.method === "POST") {
    const {
      attendee_emails,
      start_time,
      meeting_title,
      meeting_description,
    }: IBody = req.body;
    if (attendee_emails.length <= 9) {
      return res.status(500).json({
        error: true,
        reason: "Email not valid",
        status: "not completed",
        meetingLink: null,
      });
    }
    const userData = await supabaseServerClient
      .from("users")
      .select("*")
      .eq("id", data.user.id);
    if (!userData.data) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "not valid",
        meetingLink: null,
      });
    }
    const parsed_attendee_emails = attendee_emails.map((item) => {
      return { email: item };
    });
    const alternative_hosts = [""]; // admin email
    const alternative_hosts_string = alternative_hosts.join(";");
    const meeting_data = await createZoomMeeting(
      data.user.email as string,
      start_time,
      meeting_description,
      meeting_title,
      alternative_hosts_string,
      parsed_attendee_emails,
      zoom_admin_data.token
    );
    const end_date = addMinutes(new Date(start_time), 60);
    const meetings_insert_data = parsed_attendee_emails.map((item) => {
      return {
        meeting_id: meeting_data.id,
        user_email: item.email,
        zoom_link: meeting_data.join_link,
        start_time: new Date(start_time),
        allowed_to_edit: false,
        end_time: end_date,
      };
    });
    const meetings_db = await supabaseAdmin
      .from("scheduled_meeting")
      .insert(meetings_insert_data);

    if (meetings_db.error) {
      return res.status(500).json({
        error: true,
        reason: "Supabase error inserting meeting data",
        meetingLink: null,
        status: "not completed",
      });
    }

    const creator_meetings_db = await supabaseAdmin
      .from("scheduled_meeting")
      .insert({
        meeting_id: meeting_data.id,
        user_email: data.user.email,
        zoom_link: meeting_data.join_link,
        start_time: new Date(start_time),
        allowed_to_edit: true,
        end_time: end_date,
      });

    if (creator_meetings_db.error) {
      return res.status(500).json({
        error: true,
        reason: "Supabase error inserting meeting data for creator",
        meetingLink: null,
        status: "not completed",
      });
    }

    return res.status(200).json({
      status: "completed",
      error: false,
      meetingLink: meeting_data.join_link,
    });
    // start time to be in UTC
  } else if (req.method === "DELETE") {
    const { meeting_id } = req.query;
    if (!meeting_id || !data.user.email) {
      return res.status(400).json({
        error: true,
        status: "not completed",
        meetingLink: null,
        reason: "Query parameter not found",
      });
    }
    const delete_status = await deleteZoomMeeting(
      meeting_id as string,
      zoom_admin_data.token
    );
    return res.status(204).json({
      error: false,
      status: "deleted",
      meetingLink: null,
    });
  } else if (req.method === "PATCH") {
    const {
      attendee_emails,
      start_time,
      meeting_title,
      meeting_description,
    }: IBody = req.body;
    const { meeting_id } = req.query;
    if (!meeting_id || !data.user.email) {
      return res.status(400).json({
        error: true,
        status: "not completed",
        meetingLink: null,
        reason: "Query parameter not found",
      });
    }
    const alternative_hosts = [""]; // admin email
    const alternative_hosts_string = alternative_hosts.join(";");
    const updation_status = await UpdateZoomMeeting(
      { attendee_emails, start_time, meeting_title, meeting_description },
      meeting_id as string,
      zoom_admin_data.token,
      data.user.email,
      alternative_hosts_string
    );
    return res.status(200).json({
      error: false,
      status: "completed",
      meetingLink: null,
    });
  }
}
