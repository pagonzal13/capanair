"use server";

import { cookies } from "next/headers";
import { CAPAWARDS_VOTED_COOKIE_NAME } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export interface BallotVote {
  category_id: string;
  nominee_passenger_id?: string;
  nominee_passenger_ids?: string[];
}

export type SubmitBallotResult =
  | { ok: true }
  | { ok: false; error: "ALREADY_VOTED" | "VOTING_CLOSED" | "SELF_VOTE" | "EMPTY_GROUP" | "UNKNOWN" };

export async function submitCapawardsBallot(
  voterId: string,
  votes: BallotVote[]
): Promise<SubmitBallotResult> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("submit_capawards_ballot", {
    p_voter_id: voterId,
    p_votes: votes,
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "ALREADY_VOTED" };
    }
    if (error.message?.includes("VOTING_CLOSED")) {
      return { ok: false, error: "VOTING_CLOSED" };
    }
    if (error.message?.includes("SELF_VOTE_NOT_ALLOWED")) {
      return { ok: false, error: "SELF_VOTE" };
    }
    if (error.message?.includes("EMPTY_GROUP")) {
      return { ok: false, error: "EMPTY_GROUP" };
    }
    return { ok: false, error: "UNKNOWN" };
  }

  cookies().set(CAPAWARDS_VOTED_COOKIE_NAME, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return { ok: true };
}
