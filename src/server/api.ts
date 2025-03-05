import { env } from "@/env";
import axios from "axios";

export const baseAPI = axios.create({
  baseURL: env.NEXT_PUBLIC_APP_URL,
});
