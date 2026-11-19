import { useState } from "react";

export default function JobForm({
  initialData,
  onSubmit,
  onCancel,
  isPending,
  isError,
  error,
}) {
  const [lists, setLists] = useState({
    responsibilities: initialData?.responsibilities ?? [],
    requirements: initialData?.requirements ?? [],
    benefits: initialData?.benefits ?? [],
  });

  const [newItem, setNewItem] = useState({
    responsibilities: "",
    requirements: "",
    benefits: "",
  });

  const [errors, setErrors] = useState({});

  function addListItem(section, value) {
    if (!value.trim()) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [section]: "Please enter an item before adding it.",
      }));

      return;
    }

    setLists((prevLists) => ({
      ...prevLists,
      [section]: [...prevLists[section], value.trim()],
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [section]: "",
    }));

    setNewItem((prevNewItem) => ({
      ...prevNewItem,
      [section]: "",
    }));
  }

  function removeListItem(section, index) {
    setLists((prevLists) => {
      const updatedList = prevLists[section].filter(
        (_, itemIndex) => itemIndex !== index,
      );

      return {
        ...prevLists,
        [section]: updatedList,
      };
    });
  }

  function handleChange(e, section) {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [section]: "",
    }));

    setNewItem((prevItem) => ({
      ...prevItem,
      [section]: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formValues = Object.fromEntries(formData.entries());

    onSubmit({
      ...formValues,
      ...lists,
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Form Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
          {initialData ? "Edit Job Listing" : "Post a New Job"}
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          {initialData
            ? "Update the details of your job listing."
            : "Fill in the details below to publish a new position to the job portal."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs"
      >
        {/* Section 1: Role Overview */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-teal-700 uppercase tracking-wider">
            Role Overview
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Job Title *
              </label>

              <input
                id="title"
                name="title"
                type="text"
                defaultValue={initialData?.title ?? ""}
                required
                placeholder="e.g. Senior React Developer"
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="company"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Company Name *
              </label>

              <input
                id="company"
                name="company"
                type="text"
                defaultValue={initialData?.company ?? ""}
                required
                placeholder="e.g. TechFlow Inc."
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="location"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Location *
              </label>

              <input
                id="location"
                name="location"
                type="text"
                defaultValue={initialData?.location ?? ""}
                required
                placeholder="e.g. Remote (US)"
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="type"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Employment Type
              </label>

              <select
                id="type"
                name="type"
                defaultValue={initialData?.type ?? "Full-time"}
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="salary"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Salary Range
              </label>

              <input
                id="salary"
                name="salary"
                type="text"
                defaultValue={initialData?.salary ?? ""}
                placeholder="e.g. $120,000 - $140,000 / yr"
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          {/* Experience Level & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="experienceLevel"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Experience Level
              </label>

              <select
                id="experienceLevel"
                name="experienceLevel"
                defaultValue={initialData?.experienceLevel ?? "Mid-level"}
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer"
              >
                <option value="Entry-level">Entry-level</option>
                <option value="Mid-level">Mid-level</option>
                <option value="Senior-level">Senior-level</option>
                <option value="Lead / Executive">Lead / Executive</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-xs font-semibold text-zinc-700 mb-1"
              >
                Department
              </label>

              <input
                id="department"
                name="department"
                type="text"
                defaultValue={initialData?.department ?? ""}
                placeholder="e.g. Engineering, Design, Marketing"
                className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-xs font-semibold text-zinc-700 mb-1"
            >
              Short Summary / Description *
            </label>

            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description ?? ""}
              required
              placeholder="Briefly describe the role..."
              className="w-full px-3.5 py-2.5 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Section 2: Dynamic List Fields */}
        {["responsibilities", "requirements", "benefits"].map((sectionKey) => (
          <div key={sectionKey} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-zinc-900 uppercase tracking-wider">
                {sectionKey}
              </label>

              <button
                onClick={() => addListItem(sectionKey, newItem[sectionKey])}
                type="button"
                className="text-xs font-medium text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                + Add item
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newItem[sectionKey]}
                onChange={(e) => handleChange(e, sectionKey)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addListItem(sectionKey, newItem[sectionKey]);
                  }
                }}
                placeholder={`Add ${sectionKey.slice(0, -1)} point...`}
                className="flex-1 px-3.5 py-2 bg-white text-zinc-900 placeholder-zinc-400 text-sm border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>

            {errors[sectionKey] && (
              <p className="text-xs text-red-500">{errors[sectionKey]}</p>
            )}

            {lists[sectionKey].length > 0 && (
              <ul className="space-y-2">
                {lists[sectionKey].map((item, index) => (
                  <li
                    key={`${sectionKey}-${index}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm font-medium text-zinc-700 wrap-break-word flex-1 min-w-0">
                      {item}
                    </span>

                    <button
                      type="button"
                      className="text-zinc-400 hover:text-red-500 transition-colors cursor-pointer shrink-0 p-1"
                      aria-label="Remove item"
                      onClick={() => removeListItem(sectionKey, index)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {isError && <p className="text-sm text-red-500">{error.message}</p>}

        {/* Form Actions */}
        <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-medium text-xs transition-all cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            {isPending
              ? initialData
                ? "Saving..."
                : "Publishing..."
              : initialData
                ? "Save Changes"
                : "Publish Job Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}
