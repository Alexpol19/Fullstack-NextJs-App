'use client'

import { useState } from "react";
import { useAutosave } from "react-autosave";
import { deleteEntry, updateEntry } from "../utils/api";
import Spinner from "./Spinner";
import { useRouter } from "next/navigation";

export type Analysis = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  entryId: string;
  mood: string;
  summary: string;
  color: string;
  negative: boolean;
  subject: string;
}

export type Entry = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  content: string;
  analysis: Analysis | null;
}

type EditorProps = {
  entry: Entry;
}

const Editor = ({entry}: EditorProps) => {
  const [value, setValue ]= useState(entry.content);
  const [currentEntry, setEntry ]= useState(entry);
  const [isSaving, setIsSaving ]= useState(false);
  const router = useRouter();

  useAutosave({
    data: value,
    onSave: async (_text) => {
      if (_text === currentEntry.content) return
      setIsSaving(true)

      const data = await updateEntry(entry.id, _text)

      setEntry(data)
      setIsSaving(false)
    },
  });

  const handleDelete = async () => {
    await deleteEntry(entry.id)
    router.push('/journal')
  }

  return (
    <div className="w-full h-full grid grid-cols-3 gap-0 relative">
      <div className="absolute left-0 top-0 p-2">
        {isSaving ? (
          <Spinner />
        ) : (
          <div className="w-[16px] h-[16px] rounded-full bg-green-500"></div>
        )}
      </div>
      <div className="col-span-2 border border-transparent my-[5px]">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-full text-xl p-8 m-0 border-0"
        />
      </div>
      <div className="col-span-1 border-l border-black/5">
        <div
          style={{ background: currentEntry?.analysis?.color }}
          className="h-[100px] bg-blue-600 text-white p-8"
        >
          <h2 className="text-2xl bg-white/25 text-black">Analysis</h2>
        </div>
        {currentEntry && currentEntry.analysis && (
          <div>
            <ul role="list" className="divide-y divide-gray-200">
              <li className="py-4 px-8 flex items-center justify-between">
                <div className="text-xl font-semibold w-1/3">Subject</div>
                <div className="text-xl">{currentEntry.analysis.subject}</div>
              </li>
              <li className="py-4 px-8 flex items-center justify-between">
                <div className="text-xl font-semibold">Summary</div>
                <div className="text-xl text-right pl-1">{currentEntry.analysis.summary}</div>
              </li>
              <li className="py-4 px-8 flex items-center justify-between">
                <div className="text-xl font-semibold">Mood</div>
                <div className="text-xl">{currentEntry.analysis.mood}</div>
              </li>
              <li className="py-4 px-8 flex items-center justify-between">
                <div className="text-xl font-semibold">Negative</div>
                <div className="text-xl">
                  {currentEntry.analysis.negative ? 'True' : 'False'}
                </div>
              </li>
              <li className="py-4 px-8 flex items-center justify-between">
                <button
                  onClick={handleDelete}
                  type="button"
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Editor