"use client";

import { useState } from "react";

type TranslationFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  locale: string;
  entityId: string;
  entityField: "businessId" | "categoryId" | "productId";
  nameLabel: string;
  descriptionLabel: string;
  saveLabel: string;
  requiredText: string;
  maxHintLabel: string;
  nextAnchor?: string | null;
  maxName?: number;
  maxDescription?: number;
};

export function TranslationForm({
  action,
  locale,
  entityId,
  entityField,
  nameLabel,
  descriptionLabel,
  saveLabel,
  requiredText,
  maxHintLabel,
  nextAnchor,
  maxName = 80,
  maxDescription = 240
}: TranslationFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState(false);

  const nameCount = name.length;
  const descriptionCount = description.length;

  return (
    <form
      className="translation-form"
      action={action}
      onSubmit={(event) => {
        if (!name.trim()) {
          event.preventDefault();
          setShowError(true);
        }
      }}
    >
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name={entityField} value={entityId} />
      {nextAnchor ? <input type="hidden" name="nextAnchor" value={nextAnchor} /> : null}
      <label>
        <span>{nameLabel}</span>
        <input
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (showError) {
              setShowError(false);
            }
          }}
          maxLength={maxName}
          required
        />
        <div className="field-meta">
          {showError ? <span className="field-error">{requiredText}</span> : <span />}
          <span className="field-count">
            {nameCount}/{maxName} ({maxHintLabel} {maxName})
          </span>
        </div>
      </label>
      <label>
        <span>{descriptionLabel}</span>
        <textarea
          name="description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          maxLength={maxDescription}
        />
        <div className="field-meta">
          <span />
          <span className="field-count">
            {descriptionCount}/{maxDescription} ({maxHintLabel} {maxDescription})
          </span>
        </div>
      </label>
      <button className="action-button" type="submit">
        {saveLabel}
      </button>
    </form>
  );
}
