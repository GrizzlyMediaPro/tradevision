import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 py-12">
      <SignUp
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
