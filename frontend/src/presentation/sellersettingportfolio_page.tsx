"use client";

import { useState } from "react";
import { BookOpenText, Trash2, GripVertical, Plus } from "lucide-react";

type PortfolioItem = {
  id: number;
  title: string;
  description: string;
};

export default function PortfolioPage() {
  const [showModal, setShowModal] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    synopsis: '',
    article: '',
    publishMedium: '',
  });
  const [items, setItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: "Digital Dollar Dilemmas: How Central Bank Currencies Could Redefine Global Power",
      description:
        "Arthur Bills explores how Central Bank Digital Currencies, like the U.S. digital dollar, could reshape global finance by shifting power from private banks to central authorities and challenging traditional systems like SWIFT...",
    },
    {
      id: 2,
      title: "Digital Dollar Dilemmas: How Central Bank Currencies Could Redefine Global Power",
      description:
        "Arthur Bills explores how Central Bank Digital Currencies, like the U.S. digital dollar, could reshape global finance by shifting power from private banks to central authorities and challenging traditional systems like SWIFT. Arthur Bills explores how Central Bank Digital Currencies, like the U.S. digital dollar, could reshape global finance by shifting power from private banks to central authorities and challenging traditional systems.",
    },
  ]);

  const handleAdd = () => {
    const newItem: PortfolioItem = {
      id: Date.now(),
      title: "New Article Title",
      description: "Add a brief summary or article description here...",
    };
    setItems([newItem, ...items]);
  };

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#f6f2ef] p-8 text-[#1f1f1f]">
      <h1 className="text-2xl font-bold flex items-center gap-2 mb-6">
        <BookOpenText className="w-6 h-6" />
        Portfolio
      </h1>

      <div className="flex items-center bg-gray-200 px-4 py-2 rounded-lg mb-4 shadow-inner">
        <span className="font-semibold text-lg">Order</span>
        <div className="flex-1 flex justify-center">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center w-6 h-6 rounded-full text-xl text-gray-600 hover:text-black"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newItem.title}
                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Synopsis</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newItem.synopsis}
                onChange={e => setNewItem({ ...newItem, synopsis: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Article</label>
              <textarea
                className="w-full border rounded px-3 py-2"
                rows={4}
                value={newItem.article}
                onChange={e => setNewItem({ ...newItem, article: e.target.value })}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Publish Medium</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={newItem.publishMedium}
                onChange={e => setNewItem({ ...newItem, publishMedium: e.target.value })}
              />
            </div>
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded hover:bg-blue-800 w-full font-semibold"
              onClick={() => {
                const item = {
                  id: Date.now(),
                  title: newItem.title,
                  description: `${newItem.synopsis}\n${newItem.article}\nPublished in: ${newItem.publishMedium}`,
                };
                setItems([item, ...items]);
                setShowModal(false);
                setNewItem({ title: '', synopsis: '', article: '', publishMedium: '' });
              }}
            >
            Confirm           
            </button>
          </div>
        </div>
      )}
      </div>

      <hr className="border-t border-gray-400 mb-6" />

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-md px-4 py-3 flex gap-4 items-start"
          >
            <div className="pt-1">
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-base mb-1">{item.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="text-gray-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
