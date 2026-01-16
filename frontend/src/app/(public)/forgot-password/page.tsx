import FindEmailForm from "@/app/components/auth/FindEmailForm";
import ForgotPasswordForm from "@/app/components/auth/ForgotPasswordForm";


export default function FindEmailPage() {
    return (

        <div className="min-h-[calc(100vh-64px)] bg-white dark:bg-background-dark flex items-center justify-center px-6 py-20">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-items-center">

                    <div className="w-full max-w-md lg:col-span-2 flex justify-center">
                        <ForgotPasswordForm />
                    </div>

                </div>
            </div>
        </div>

    );
}
