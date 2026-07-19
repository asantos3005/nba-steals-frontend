import { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

export default function DataViewer() {
  const [players, setPlayers] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const columns = useMemo(
    () => [
      {
        accessorKey: "playerName",
        header: "Player",
      },
      {
        accessorKey: "team",
        header: "Team",
      },
      {
        accessorKey: "gamesPlayed",
        header: "Games Played",
      },
      {
        accessorKey: "steals",
        header: "Steals",
      },
    ],
    []
  );

  const table = useReactTable({
    data: players,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const response = await fetch("/api/player/get-steal-leaders");

        if (!response.ok) {
          throw new Error("Unable to load player data.");
        }

        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  return (
    <section className="min-h-[100svh] bg-indigo-900 px-6 py-16 text-slate-50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              TanStack Table
            </p>
            <h1 className="text-3xl font-bold">NBA Steals Stats 2026 Season</h1>
          </div>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-200">
            Search players
            <input
              type="search"
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="w-full rounded-md border border-indigo-300 bg-slate-50 px-3 py-2 text-slate-950 outline-none focus:border-cyan-300 sm:w-72"
              placeholder="Player or team"
            />
          </label>
        </div>

        {isLoading && <p className="text-slate-200">Loading player data...</p>}
        {errorMessage && <p className="text-red-200">{errorMessage}</p>}

        {!isLoading && !errorMessage && (
          <div className="overflow-x-auto rounded-lg border border-indigo-700 bg-slate-950/40">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-950/60 text-sm uppercase text-cyan-100">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3">
                        <button
                          type="button"
                          onClick={header.column.getToggleSortingHandler()}
                          className="flex items-center gap-2 font-semibold"
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          <span aria-hidden="true">
                            {{
                              asc: "↑",
                              desc: "↓",
                            }[header.column.getIsSorted()] ?? "↕"}
                          </span>
                        </button>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-t border-indigo-800 odd:bg-indigo-950/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {table.getRowModel().rows.length === 0 && (
              <p className="px-4 py-6 text-center text-slate-300">
                No players match your search.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
