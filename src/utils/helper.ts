import { IBody } from './../global/index';
import axios from "axios";
import b64 from "base-64";
import {
  ZOOM_ADMIN_ID,
  ZOOM_BASE_URL,
  ZOOM_SECRET_TOKEN,
} from "@/constants/main";

export async function GenerateZoomAdminData() {
  let configData;
  try {
    const { data } = await axios.get(
      (ZOOM_BASE_URL as string) +
        `/oauth/token?grant_type=account_credentials&account_id=${ZOOM_ADMIN_ID}`,
      {
        headers: {
          Authorization:
            "Basic " + b64.encode(`${ZOOM_ADMIN_ID}:${ZOOM_SECRET_TOKEN}`),
        },
      }
    );
    configData = data;
  } catch (error) {
    console.log(error);
  }
  return configData;
}

export function addMinutes(date: Date, minutes: number) {
  date.setMinutes(date.getMinutes() + minutes);

  return date;
}

export async function deleteZoomMeeting(meeting_id: string, token: string) {
  let configData;
  try {
    const { data } = await axios.get(
      (ZOOM_BASE_URL as string) + `/meetings/${meeting_id}`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    configData = data;
  } catch (error) {
    console.log(error);
  }
  return configData;
}

export async function UpdateZoomMeeting(
  config: IBody,
  meeting_id: string,
  token: string,
  email: string,
  alternative_hosts_string: string
) {
  const zoom_config_updated = {
    agenda: config.meeting_title,
    default_password: false,
    duration: 60,
    password: "123456",
    pre_schedule: true,
    schedule_for: email,
    settings: {
      additional_data_center_regions: ["TY"],
      allow_multiple_devices: true,
      alternative_hosts: alternative_hosts_string,
      auto_recording: "cloud",
      calendar_type: 1,
      contact_email: email,
      contact_name: email?.split("@")[0],
      email_notification: true,
      encryption_type: "enhanced_encryption",
      focus_mode: true,
      host_video: true,
      jbh_time: 5, // minutes before the meeting starts allowed to join
      join_before_host: false,
      meeting_authentication: true,
      meeting_invitees: config.attendee_emails.map((item) => { email: item }),
      mute_upon_entry: false,
      participant_video: false,
      private_meeting: false,
      registrants_confirmation_email: true,
      registrants_email_notification: true,
      registration_type: 1,
      show_share_button: true,
      use_pmi: false,
      waiting_room: false,
      watermark: false,
      host_save_video_order: true,
      alternative_host_update_polls: true,
    },
    start_time: config.start_time,
    timezone: "UTC",
    topic: config.meeting_description,
    type: 2,
  };
  const { data } = await axios.patch(
    (ZOOM_BASE_URL as string) + `/meetings/${meeting_id}`,
    zoom_config_updated,
    {
      headers: {
        Authorization: "Bearer" + token,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}

export async function createZoomMeeting(
  email: string,
  start_time: string,
  meeting_description: string,
  meeting_title: string,
  alternative_hosts_string: string,
  parsed_attendee_emails: Array<{
    email: string;
  }>,
  token: string
) {
  const zoom_api_config = {
    agenda: meeting_title,
    default_password: false,
    duration: 60,
    password: "123456",
    pre_schedule: true,
    schedule_for: email,
    settings: {
      additional_data_center_regions: ["TY"],
      allow_multiple_devices: true,
      alternative_hosts: alternative_hosts_string,
      auto_recording: "cloud",
      calendar_type: 1,
      contact_email: email,
      contact_name: email?.split("@")[0],
      email_notification: true,
      encryption_type: "enhanced_encryption",
      focus_mode: true,
      host_video: true,
      jbh_time: 5, // minutes before the meeting starts allowed to join
      join_before_host: false,
      meeting_authentication: true,
      meeting_invitees: parsed_attendee_emails,
      mute_upon_entry: false,
      participant_video: false,
      private_meeting: false,
      registrants_confirmation_email: true,
      registrants_email_notification: true,
      registration_type: 1,
      show_share_button: true,
      use_pmi: false,
      waiting_room: false,
      watermark: false,
      host_save_video_order: true,
      alternative_host_update_polls: true,
    },
    start_time: start_time,
    timezone: "UTC",
    topic: meeting_description,
    type: 2,
  };
  const { data } = await axios.post(
    (ZOOM_BASE_URL as string) + "/users/me/meetings",
    zoom_api_config,
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    }
  );
  return data;
}
