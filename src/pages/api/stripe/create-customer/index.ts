import { STRIPE_SECRET_KEY } from "@/constants/main";
import { supabaseAdmin } from "@/utils/supabase-instance";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

type Data = {
  error: boolean;
  status: "completed" | "not completed";
  reason?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const supabaseServerClient = createServerSupabaseClient({
      req,
      res,
    });
    const { data, error } = await supabaseServerClient.auth.getUser();
    if (!data.user || error) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "Unauthorized",
      });
    }
    const userData = await supabaseServerClient
      .from("users")
      .select("*")
      .eq("id", data.user.id);
    if (!userData.data || userData.error) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "not valid",
      });
    }
    const customer = await stripe.accounts.create({
      email: data.user.email,
    });
    const sData = await supabaseAdmin
      .from("users")
      .update({
        stripe_id: customer.id,
      })
      .eq("id", data.user.id);
    if (!sData.data || sData.error) {
      return res.status(200).json({
        error: false,
        status: "completed",
        reason: "supabase update failed"
      });
    }
    return res.status(200).json({
      error: false,
      status: "completed",
    });
  } else {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "Invalid request",
    });
  }
}
