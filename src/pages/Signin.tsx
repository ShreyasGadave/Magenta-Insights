import AuthForm from "@/components/custom/AuthForm";

const Signin = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm />
      </div>
    </div>
  );
};

export default Signin;
