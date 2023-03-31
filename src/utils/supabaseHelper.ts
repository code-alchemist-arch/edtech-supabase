import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient, SupabaseClient, User } from "@supabase/auth-helpers-nextjs";

export class SupabaseHelper {
    private static async getUser(client: SupabaseClient): Promise<User | null> {
        const {data} = await client.auth.getUser();
        return data?.user ?? null;
    }

    //Returns null if user session not found
    static async getUserSessionFromReq(req: NextApiRequest, res: NextApiResponse): Promise<User | null> {
        const supabaseServerClient = createServerSupabaseClient({req, res});
        return await this.getUser(supabaseServerClient)
    }

    //Returns null if user session not found
    static async getUserSessionFromContext(context: GetServerSidePropsContext): Promise<User | null> {
        const supabaseServerClient = createServerSupabaseClient(context);
        return await this.getUser(supabaseServerClient)
    }
}