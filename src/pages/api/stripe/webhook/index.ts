import Stripe from "stripe";
import type { NextApiRequest, NextApiResponse } from "next";
import { STRIPE_SECRET_KEY, WEBHOOK_SECRET } from "@/constants/main";
import { supabaseAdmin } from "@/utils/supabase-instance";

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: "2022-11-15",
});

type Data = {
  error: boolean;
  reason?: string;
};
const cryptoProvider = Stripe.createSubtleCryptoProvider();

export default async function handler(event: {
  req: NextApiRequest;
  res: NextApiResponse<Data>;
}) {
  console.log("Stripe webhook - Request received - /api/stripe/webhooks");
  const signature = event.req.headers["Stripe-Signature"];
  if (!signature || !WEBHOOK_SECRET)
    return event.res.status(401).json({
      error: true,
      reason: "No signature",
    });

  const body = event.req.body;

  let receivedEvent;
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      WEBHOOK_SECRET,
      undefined,
      cryptoProvider
    );
  } catch (err) {
    console.log(
      "Stripe webhook - Error constructing event: ",
      (err as Error).message
    );
    return event.res
      .status(401)
      .json({ error: true, reason: "Failed constructing event" });
  }

  console.log(`Stripe webhook - Event received: ${receivedEvent.id}`);

  const requestOptions =
    receivedEvent.request && receivedEvent.request.idempotency_key
      ? {
          idempotencyKey: receivedEvent.request.idempotency_key,
        }
      : {};

  let retrievedEvent: Stripe.Response<Stripe.Event>;
  try {
    retrievedEvent = await stripe.events.retrieve(
      receivedEvent.id,
      requestOptions
    );
  } catch (err) {
    return event.res.status(400).json({
      error: true,
      reason: "Unable to retrieve events",
    });
  }

  const subscription = retrievedEvent.data.object as Stripe.Subscription;
  const customerId = subscription.customer;
  // @ts-ignore
  const productId = subscription.plan?.product;
  if (customerId && productId)
    console.log(
      `Stripe webhook - Customer ID: ${customerId} - Product: ${productId}`
    );

  switch (retrievedEvent.type) {
    case "checkout.session.completed":
      // Payment is successful and the subscription is created.
      // You should provision the subscription and save the customer ID to your database.
      const userData = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("stripe_id", customerId);
      const courseData = await supabaseAdmin
        .from("product")
        .select("*")
        .eq("product_id", productId);
      if (!userData.data || userData.error) {
        return event.res.status(400).json({
          error: true,
          reason: "userData not found",
        });
      }
      if (!courseData.data || courseData.error) {
        return event.res.status(400).json({
          error: true,
          reason: "courseData not found",
        });
      }
      const {} = await supabaseAdmin.from("purchased_courses").insert({
        course_id: courseData.data[0].course_id,
        user_id: userData.data[0].stripe_id,
      });
      break;
    default:
      if (retrievedEvent.type)
        console.log(`Unhandled event type ${receivedEvent.type}`);
    // Unhandled event type
  }
}
