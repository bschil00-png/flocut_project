import LoginForm from "@/app/components/member/LoginForm";

export default function LoginPage() {
    return (
        <div
            className="
        min-h-[calc(100vh-64px)]
        bg-background-light dark:bg-background-dark
        flex items-start justify-center
        px-4
        pt-28
      "
        >
            <LoginForm />
        </div>
    );
}
