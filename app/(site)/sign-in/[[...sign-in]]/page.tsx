import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 py-12">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white/5 border border-white/10 shadow-2xl",
          },
        }}
      />
    </main>
  );
}
