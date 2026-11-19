import {
  Form,
  Link,
  useActionData,
  useSearchParams,
  useNavigation,
} from "react-router-dom";

export default function LoginPage() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [searchParams] = useSearchParams();
  const sessionExpired = searchParams.get("sessionExpired") === "true";
  const isLogin = (searchParams.get("mode") || "login") === "login";

  const actionData = useActionData();
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-lg shadow-xs">
            JP
          </span>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        {isLogin ? (
          <div className="mt-2 text-center text-sm text-zinc-600">
            Don't have an account?{" "}
            <Link
              to="/auth?mode=signup"
              className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="mt-2 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              to="/auth?mode=login"
              className="font-medium text-teal-600 hover:text-teal-700 transition-colors"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-zinc-200/80 rounded-3xl sm:px-10">
          {sessionExpired && (
            <p className="mb-4 text-sm text-amber-700 text-center" role="alert">
              Your session has expired. Please log in again.
            </p>
          )}
          {actionData?.error && (
            <p className="mb-4 text-sm text-red-600 text-center" role="alert">
              {actionData.error}
            </p>
          )}
          {actionData?.message && (
            <p
              className="mb-4 text-sm text-green-700 text-center"
              role="status"
            >
              {actionData.message}
            </p>
          )}
          <Form method="post" className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {!isLogin && (
              <>
                {/* Confirm Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="confirm-password"
                      className="block text-sm font-medium text-zinc-700"
                    >
                      Confirm Password
                    </label>
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </>
            )}
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-xl shadow-xs text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? "Please wait..."
                  : isLogin
                    ? "Sign in"
                    : "Sign up"}
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
