import FindEmailForm from "@/app/components/auth/FindEmailForm";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";

export default function test() {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <FindEmailForm />
            <ForgotPasswordForm />

        </div>
    )
}