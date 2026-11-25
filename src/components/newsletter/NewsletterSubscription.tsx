"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import { FiCheck } from "react-icons/fi";

export default function NewsletterSubscription({
  requireValidInput = false,
  className = "",
}: {
  requireValidInput?: boolean;
  /** Kept for older callers; sizing is shared across every page. */
  scaled?: boolean;
  className?: string;
}) {
  const formId = useId();
  const titleId = `${formId}-title`;
  const emailId = `${formId}-email`;
  const feedbackId = `${formId}-feedback`;
  const [email, setEmail] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    field?: "email" | "consent";
  } | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  function submitSubscription(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) {
      setFeedback({ message: "E-posta adresinizi giriniz.", field: "email" });
      emailRef.current?.focus();
    } else if (
      emailRef.current?.validity.typeMismatch ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      setFeedback({
        message: "Geçerli bir e-posta adresi giriniz.",
        field: "email",
      });
      emailRef.current?.focus();
    } else if (!consentAccepted) {
      setFeedback({
        message:
          "Devam etmek için aydınlatma ve açık rıza onayını vermelisiniz.",
        field: "consent",
      });
      consentRef.current?.focus();
    } else {
      // Frontend preview only: no subscription is stored or sent.
      setFeedback({
        message: "Abonelik başvuru sistemi yakında aktif olacaktır.",
      });
    }
  }
  return (
    <section
      data-newsletter
      className={`relative left-1/2 mt-[calc(60*var(--newsletter-spacing-unit,var(--standard-unit,1px)))] w-[min(1200px,83.333333vw)] -translate-x-1/2 font-sans tracking-normal [font-weight:410]! [font-stretch:125%]! [font-variation-settings:'wght'_410,'wdth'_125]! ${className}`}
      aria-labelledby={titleId}
    >
      <form
        data-newsletter-form
        className="grid! min-h-[76px] grid-cols-1 items-center gap-5 rounded-lg bg-[#f7f7f7] p-6 md:grid-cols-[212px_minmax(0,1fr)_135px] md:py-5 xl:grid-cols-[212px_308px_135px_minmax(0,1fr)] xl:gap-[29px] xl:px-[26px] xl:py-2"
        noValidate
        onSubmit={submitSubscription}
      >
        <h2
          id={titleId}
          className="m-0 text-[28px]! leading-none! font-[410]! text-[#0d5792]! md:text-[30px]!"
        >
          Newsletter
          <br />
          Subscription
        </h2>
        <label className="sr-only" htmlFor={emailId}>
          E-posta adresi
        </label>
        <input
          ref={emailRef}
          id={emailId}
          className="h-[45px] w-full min-w-0 rounded-lg border-0 bg-white px-[25px] py-[3px] font-[inherit]! text-[15px]! leading-none! text-[#0d5792]! backdrop-blur-[30px] placeholder:text-[#0d5792] placeholder:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#005eff]"
          type="email"
          autoComplete="email"
          placeholder="E-Mail"
          required
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFeedback(null);
          }}
          aria-invalid={feedback?.field === "email"}
          aria-describedby={
            feedback?.field === "email" ? feedbackId : undefined
          }
        />
        <button
          className="h-[45px] cursor-pointer rounded-lg border-0 bg-[#005eff] px-[25px] py-[3px] font-[inherit]! text-[15px]! leading-none! text-white! hover:enabled:bg-[#004bd1] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#005eff] disabled:cursor-not-allowed disabled:opacity-100"
          type="submit"
          disabled={requireValidInput && (!validEmail || !consentAccepted)}
        >
          Subscribe
        </button>
        <label
          className="flex! min-w-0 cursor-pointer items-start gap-[10px] text-[13px]! leading-[1.3]! text-[#27272a]! md:col-span-3 xl:col-auto xl:leading-[1.15]!"
          lang="tr"
        >
          <span className="relative size-[18px] shrink-0">
            <input
              ref={consentRef}
              className="peer m-0 block! size-[18px] cursor-pointer appearance-none rounded-[4px] border border-[#9eb7d0] bg-white checked:border-[#005eff] checked:bg-[#005eff] hover:border-[#005eff] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#005eff]"
              type="checkbox"
              required
              checked={consentAccepted}
              onChange={(event) => {
                setConsentAccepted(event.target.checked);
                setFeedback(null);
              }}
              aria-invalid={feedback?.field === "consent"}
              aria-describedby={
                feedback?.field === "consent" ? feedbackId : undefined
              }
            />
            <FiCheck
              aria-hidden="true"
              className="pointer-events-none absolute top-[2px] left-[2px] hidden size-[14px] text-white peer-checked:block"
            />
          </span>
          <span>
            <span>Aydınlatma Metnini</span> okudum ve{" "}
            <span>Açık Rıza Metni</span>’ni okudum, anladım ve e-posta aboneliği
            başvurusu yaparak açık rızamı verdiğimi beyan ederim.
          </span>
        </label>
      </form>
      <p
        id={feedbackId}
        className="absolute top-full right-0 left-0 mt-[10px] text-[13px]! leading-[1.3]! text-[#0d5792]! data-[error=true]:text-[#9b3131]! md:right-[26px] md:left-[26px]"
        data-error={Boolean(feedback?.field)}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        lang="tr"
      >
        {feedback?.message}
      </p>
    </section>
  );
}
