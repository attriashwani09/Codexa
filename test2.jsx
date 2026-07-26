import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router-dom";

const TAG_OPTIONS = [
  { value: "array", label: "Array" },
  { value: "linkedlist", label: "Linked List" },
  { value: "graph", label: "Graph" },
  { value: "dp", label: "DP" },
  { value: "tree", label: "Tree" },
  { value: "math", label: "Math" },
  { value: "sorting", label: "Sorting" },
];

const DIFFICULTY_OPTIONS = [
  { value: "easy", label: "Easy", ring: "ring-emerald-500", dot: "bg-emerald-500", text: "text-emerald-600" },
  { value: "medium", label: "Medium", ring: "ring-amber-500", dot: "bg-amber-500", text: "text-amber-600" },
  { value: "hard", label: "Hard", ring: "ring-rose-500", dot: "bg-rose-500", text: "text-rose-600" },
];

const LANGUAGES = ["c++", "java", "javascript"];

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z
    .array(z.enum(["array", "linkedlist", "graph", "dp", "tree", "math", "sorting"]))
    .min(1, "Select at least one tag"),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
        explanation: z.string().optional(),
      })
    )
    .min(1, "At least one visible test case is required"),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input is required"),
        output: z.string().min(1, "Output is required"),
      })
    )
    .min(1, "At least one hidden test case is required"),
  startCode: z.array(
    z.object({
      language: z.string(),
      initialCode: z.string().min(1, "Starter code is required"),
    })
  ),
  referenceSolution: z.array(
    z.object({
      language: z.string(),
      completeCode: z.string().min(1, "Reference solution is required"),
    })
  ),
});

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-rose-600">{message}</p>;
}

function SectionCard({ id, index, title, subtitle, children, action }) {
  return (
    <section id={id} className="scroll-mt-6 rounded-lg border border-base-300 bg-base-100">
      <div className="flex items-start justify-between gap-4 border-b border-base-300 px-6 py-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-xs text-base-content/40">{index}</span>
          <div>
            <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-base-content">
              {title}
            </h2>
            {subtitle && <p className="mt-1 text-sm text-base-content/60">{subtitle}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

const inputClass =
  "w-full rounded-md border border-base-300 bg-base-100 px-3 py-2.5 text-sm text-base-content placeholder:text-base-content/40 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20";

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "easy",
      tags: ["array"],
      visibleTestCases: [{ input: "", output: "", explanation: "" }],
      hiddenTestCases: [{ input: "", output: "" }],
      startCode: LANGUAGES.map((language) => ({ language, initialCode: "" })),
      referenceSolution: LANGUAGES.map((language) => ({ language, completeCode: "" })),
    },
  });

  const {
    fields: visibleFields,
    append: appendVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    append: appendHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  const watchedDifficulty = watch("difficulty");
  const watchedTags = watch("tags") || [];
  const watchedTitle = watch("title");
  const activeDifficulty = DIFFICULTY_OPTIONS.find((d) => d.value === watchedDifficulty);

  const onSubmit = async (data) => {
    try {
      await axiosClient.post("/problem/create", data);
      alert("Problem Created Successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || err?.response?.data?.message || err.message);
    }
  };

  const navItems = [
    { id: "section-basics", label: "01 · Basics" },
    { id: "section-visible", label: "02 · Visible cases" },
    { id: "section-hidden", label: "03 · Hidden cases" },
    { id: "section-code", label: "04 · Code" },
  ];

  return (
    <div className="min-h-screen bg-base-200">
      <div className="mx-auto max-w-6xl px-4 py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10 lg:px-6">
        {/* SIDEBAR */}
        <aside className="mb-8 lg:sticky lg:top-10 lg:mb-0 lg:self-start">
          <p className="font-mono text-xs text-base-content/40">/admin/problems/new</p>
          <h1 className="mt-1 text-2xl font-bold text-base-content">
            {watchedTitle ? watchedTitle : "Create Problem"}
          </h1>

          <nav className="mt-6 hidden flex-col gap-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-md px-3 py-2 font-mono text-xs text-base-content/60 transition hover:bg-base-300 hover:text-base-content"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* live spec summary — signature element */}
          <div className="mt-8 rounded-lg border border-base-300 bg-base-100 p-4">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-wide text-base-content/40">
              Spec summary
            </p>
            <div className="space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">difficulty</span>
                <span className={`flex items-center gap-1.5 font-semibold ${activeDifficulty?.text}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${activeDifficulty?.dot}`} />
                  {activeDifficulty?.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">tags</span>
                <span className="text-base-content">{watchedTags.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">visible cases</span>
                <span className="text-base-content">{visibleFields.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base-content/60">hidden cases</span>
                <span className="text-base-content">{hiddenFields.length}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <SectionCard id="section-basics" index="01" title="Basic information">
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-base-content/60">Title</label>
                <input {...register("title")} placeholder="Two Sum" className={inputClass} />
                <FieldError message={errors.title?.message} />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                  Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Explain the problem statement, constraints, and examples..."
                  rows={7}
                  className={`${inputClass} font-mono leading-relaxed`}
                />
                <FieldError message={errors.description?.message} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                    Difficulty
                  </label>
                  <Controller
                    name="difficulty"
                    control={control}
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {DIFFICULTY_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => field.onChange(opt.value)}
                            className={`flex-1 rounded-md border px-3 py-2.5 text-sm font-medium capitalize transition ${
                              field.value === opt.value
                                ? `border-transparent bg-base-content text-base-100 ring-2 ${opt.ring} ring-offset-2 ring-offset-base-100`
                                : "border-base-300 text-base-content/60 hover:border-base-content/30"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-base-content/60">Tags</label>
                  <Controller
                    name="tags"
                    control={control}
                    render={({ field }) => (
                      <div className="flex flex-wrap gap-2">
                        {TAG_OPTIONS.map((tag) => {
                          const selected = field.value?.includes(tag.value);
                          return (
                            <button
                              key={tag.value}
                              type="button"
                              onClick={() =>
                                field.onChange(
                                  selected
                                    ? field.value.filter((v) => v !== tag.value)
                                    : [...(field.value || []), tag.value]
                                )
                              }
                              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                                selected
                                  ? "border-cyan-500 bg-cyan-500/10 text-cyan-700"
                                  : "border-base-300 text-base-content/60 hover:border-base-content/30"
                              }`}
                            >
                              {tag.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  />
                  <FieldError message={errors.tags?.message} />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            id="section-visible"
            index="02"
            title="Visible test cases"
            subtitle="Shown to the user as worked examples."
            action={
              <button
                type="button"
                onClick={() => appendVisible({ input: "", output: "", explanation: "" })}
                className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
              >
                + Add case
              </button>
            }
          >
            <FieldError message={errors.visibleTestCases?.message} />
            <div className="space-y-4">
              {visibleFields.map((field, index) => (
                <div key={field.id} className="rounded-md border border-base-300 bg-base-200/40 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[11px] text-base-content/40">
                      case_{String(index + 1).padStart(2, "0")}
                    </span>
                    {visibleFields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVisible(index)}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <input
                        {...register(`visibleTestCases.${index}.input`)}
                        placeholder="Input"
                        className={`${inputClass} font-mono`}
                      />
                      <FieldError message={errors.visibleTestCases?.[index]?.input?.message} />
                    </div>
                    <div>
                      <input
                        {...register(`visibleTestCases.${index}.output`)}
                        placeholder="Output"
                        className={`${inputClass} font-mono`}
                      />
                      <FieldError message={errors.visibleTestCases?.[index]?.output?.message} />
                    </div>
                  </div>
                  <textarea
                    {...register(`visibleTestCases.${index}.explanation`)}
                    placeholder="Explanation (optional)"
                    rows={2}
                    className={`${inputClass} mt-3`}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="section-hidden"
            index="03"
            title="Hidden test cases"
            subtitle="Used for grading only — never shown to the user."
            action={
              <button
                type="button"
                onClick={() => appendHidden({ input: "", output: "" })}
                className="rounded-md bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-cyan-700"
              >
                + Add case
              </button>
            }
          >
            <FieldError message={errors.hiddenTestCases?.message} />
            <div className="space-y-3">
              {hiddenFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid gap-3 rounded-md border border-dashed border-base-300 bg-base-200/40 p-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-center"
                >
                  <span className="font-mono text-[11px] text-base-content/40">
                    hidden_{String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <input
                      {...register(`hiddenTestCases.${index}.input`)}
                      placeholder="Input"
                      className={`${inputClass} font-mono`}
                    />
                    <FieldError message={errors.hiddenTestCases?.[index]?.input?.message} />
                  </div>
                  <div>
                    <input
                      {...register(`hiddenTestCases.${index}.output`)}
                      placeholder="Output"
                      className={`${inputClass} font-mono`}
                    />
                    <FieldError message={errors.hiddenTestCases?.[index]?.output?.message} />
                  </div>
                  {hiddenFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHidden(index)}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            id="section-code"
            index="04"
            title="Code templates & solutions"
            subtitle="Starter code and a reference solution for every supported language."
          >
            <div className="space-y-8">
              {LANGUAGES.map((lang, index) => (
                <div key={lang}>
                  <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wide text-base-content/70">
                    {lang}
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                        Starter code
                      </label>
                      <textarea
                        {...register(`startCode.${index}.initialCode`)}
                        rows={8}
                        placeholder="Starter code"
                        className={`${inputClass} font-mono leading-relaxed`}
                      />
                      <FieldError message={errors.startCode?.[index]?.initialCode?.message} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-base-content/60">
                        Reference solution
                      </label>
                      <textarea
                        {...register(`referenceSolution.${index}.completeCode`)}
                        rows={8}
                        placeholder="Reference solution"
                        className={`${inputClass} font-mono leading-relaxed`}
                      />
                      <FieldError message={errors.referenceSolution?.[index]?.completeCode?.message} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-cyan-600 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating problem..." : "Create problem"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;