import { redirect } from "next/navigation";

export default function ChatbotsRedirect() {
    redirect("/dashboard/agents");
}
