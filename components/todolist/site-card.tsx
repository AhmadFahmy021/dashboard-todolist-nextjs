import React from "react";
import { DataTable } from "../data-table";
import data from "../../app/dashboard/data.json";

export default function SiteCard() {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">Site Card</h2>
      <p className="text-gray-600 dark:text-gray-300">
        <DataTable data={data} />
      </p>
    </div>
  );
}