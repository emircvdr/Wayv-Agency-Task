import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function Login(form: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function Logout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
  return true;
}

export async function GetUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
