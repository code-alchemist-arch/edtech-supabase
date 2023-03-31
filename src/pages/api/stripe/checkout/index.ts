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
    const { course_id } = req.body;
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
      });
    }
    if (userData.data.length > 0) {
      const userInfo = userData.data[0];
      const courseData = await supabaseAdmin
        .from("product")
        .select("*")
        .eq("course_id", course_id);
      if (courseData.error) {
        return res.status(500).json({
          error: true,
          status: "not completed",
          reason: "Supabase course table fail",
        });
      }
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price: courseData.data[0].price_id,
            quantity: 1,
          },
        ],
        client_reference_id: userInfo.stripe_id,
        success_url: "/dashboard?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "/dashboard",
      });
      if (!session.url) {
        return res.status(500).json({
          error: true,
          status: "not completed",
          reason: "stripe session creation failed",
        });
      }
      return res.redirect(session.url);
    }
  } else {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "invalid request method",
    });
  }
}
