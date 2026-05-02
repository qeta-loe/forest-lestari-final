import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data } = await supabase
    .from("articles")
    .select("*");

  return (
    <div>
      <h1>Articles</h1>

      {data?.map((item) => (
        <p key={item.id}>{item.title}</p>
      ))}
    </div>
  );
}