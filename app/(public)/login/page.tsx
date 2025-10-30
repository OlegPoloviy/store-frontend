import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="bg-[#FAFAFA] ">
      <div>
        <div className="grid lg:grid-cols-2 min-h-screen">
          {/* Left side - Registration Form */}
          <div className="flex flex-col justify-center w-full p-6 lg:p-8 xl:p-12">
            <div className="w-full max-w-2xl mx-auto">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                  Create Your Account
                </h1>
                <p className="text-base lg:text-lg text-gray-600">
                  Join our community and discover premium hand-made furniture
                </p>
              </div>

              {/* Registration Form Component */}
              <LoginForm />
            </div>
          </div>

          {/* Right side - Hero Image */}
          <div className="relative hidden lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/background_hero.png')",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
