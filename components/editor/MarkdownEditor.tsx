// components/editor/MarkdownEditor.tsx
"use client";

import React, { useState } from "react";
import Editor, { OnChange } from "@monaco-editor/react";

interface MarkdownEditorProps {
  initialValue?: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const MarkdownEditor = ({ 
  initialValue = "", 
  onChange, 
  readOnly = false 
}: MarkdownEditorProps) => {
  const [value, setValue] = useState(initialValue);

  // Az OnChange típus használatával a 'value' nem lesz 'any'
  const handleEditorChange: OnChange = (newValue) => {
    const content = newValue || "";
    setValue(content);
    onChange(content);
  };

  return (
    <div className="border border-slate-800 rounded-md overflow-hidden h-[400px] w-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        theme="vs-dark"
        value={value}
        onChange={handleEditorChange}
        options={{
          readOnly: readOnly,
          minimap: { enabled: false },
          wordWrap: 'on',
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          padding: { top: 10 }
        }}
      />
    </div>
  );
};