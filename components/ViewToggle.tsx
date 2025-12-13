"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, CircuitBoard } from "lucide-react"; // Імпортуємо іконки

export function ViewToggle() {
  return (
    <Tabs defaultValue="list" className="w-fit">
      <TabsList className="bg-white border border-gray-200 h-auto p-1 rounded-lg gap-1">
        {/* --- Кнопка "Список" --- */}
        <TabsTrigger
          value="list"
          className="
            flex items-center gap-2 px-4 py-2 rounded-md transition-all
            data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white data-[state=active]:shadow-none
            text-gray-500 hover:text-gray-900
          "
        >
          <LayoutGrid className="w-4 h-4" />
          <span>List</span>
        </TabsTrigger>

        {/* --- Кнопка "Мудборд" --- */}
        <TabsTrigger
          value="moodboard"
          className="
            flex items-center gap-2 px-4 py-2 rounded-md transition-all
            data-[state=active]:bg-[#1a1a1a] data-[state=active]:text-white data-[state=active]:shadow-none
            text-gray-500 hover:text-gray-900
          "
        >
          <CircuitBoard className="w-4 h-4" />
          <span> Moodboard</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
