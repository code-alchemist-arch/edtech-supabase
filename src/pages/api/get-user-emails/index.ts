import { createServerSupabaseClient, User } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  id?: string | string[];
  error: boolean;
  data: undefined | Array<User>;
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
  const {data} = await supabaseServerClient.auth.admin.listUsers();
  console.log(data)
  res
    .status(200)
    .json({ error: false, data: data.users });
}
