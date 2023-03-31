import { CONTENTFUL_ACCESS_TOKEN, STRIPE_SECRET_KEY } from "@/constants/main";
import { IContentfulFields, IContentfulSys } from "@/global";
import { supabaseAdmin } from "@/utils/supabase-instance";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

type Data = {
  error: boolean;
  status: "completed" | "not completed" | "updated" | "deleted";
  reason?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const language = "en-US";
  const access_token = req.headers["access-token"];
  if (access_token !== CONTENTFUL_ACCESS_TOKEN) {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "unauthorized",
    });
  }
  if (req.method === "POST") {
    const fields: IContentfulFields = req.body.fields;
    const sys: IContentfulSys = req.body.sys;
    const { data, error } = await supabaseAdmin
      .from("product")
      .select("*")
      .eq("course_id", sys.id);
    if (error) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "Supabase error",
      });
    }
    const title = fields.title[language];
    const price = fields.price[language];
    const course_description = fields.description[language].content[0].content
      .map((data) => data.value)
      .join(" ");
    const instructor = fields.instructor[language].sys.id;

    // for updating the product in stripe and db;
    if (data.length > 0) {
      // for updating
      const updated_product = await stripe.products.update(data[0].product_id, {
        name: title,
        description: course_description,
      });
      if (price !== data[0].price) {
        const updated_price = await stripe.prices.create({
          product: updated_product.id,
          unit_amount: price * 100,
          currency: "usd",
          metadata: {
            instructor_id: instructor,
            publisher_id: sys.createdBy.sys.id,
          },
        });
        const supabase_updated = await supabaseAdmin
          .from("product")
          .update({ price_id: updated_price.id })
          .eq("course_id", sys.id);
      }

      return res.status(200).json({
        error: false,
        status: "updated",
      });
    }

    const product = await stripe.products.create({
      name: title,
      description: course_description,
      metadata: {
        instructor_id: instructor,
        publisher_id: sys.createdBy.sys.id,
      },
    });
    if (product) {
      const prices = await stripe.prices.create({
        currency: "usd",
        product: product.id,
        unit_amount: price * 100,
        metadata: {
          instructor_id: instructor,
          publisher_id: sys.createdBy.sys.id,
        },
      });
      const _ = await supabaseAdmin.from("product").insert({
        course_id: sys.id,
        product_id: product.id,
        price_id: prices.id,
        price: price,
      });
      return res.status(200).json({
        error: false,
        status: "completed",
      });
    } else {
      return res.status(200).json({
        error: true,
        status: "not completed",
        reason: "Stripe error",
      });
    }
  } else if (req.method === "DELETE") {
    console.log(req);
    const sys: IContentfulSys = req.body.sys;
    const { error } = await supabaseAdmin
      .from("product")
      .delete()
      .eq("course_id", sys.id);
    if (error) {
      return res.status(500).json({
        error: true,
        status: "not completed",
        reason: "Supabase error in deleting",
      });
    }
    return res.status(200).json({
      error: false,
      status: "deleted",
    });
  } else {
    return res.status(500).json({
      error: true,
      status: "not completed",
      reason: "Invalid Request Type",
    });
  }
};