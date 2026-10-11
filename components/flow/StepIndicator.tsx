const STEPS = ["Add passage", "Choose benchmark", "Make notes"];

export function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <nav aria-label="Progress">
      <ol className="steps">
        {STEPS.map((label, i) => {
          const n = i + 1;
          const state = n === step ? "current" : n < step ? "done" : "todo";
          return (
            <li key={label} className={state} aria-current={state === "current" ? "step" : undefined}>
              <span className="step-dot" aria-hidden="true">
                {state === "done" ? "✓" : n}
              </span>
              <span>
                <span className="sr-only">
                  Step {n} of 3{state === "done" ? ", finished" : ""}:{" "}
                </span>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
