import { Loader2, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DataTable({
  title,
  columns = [],
  data = [],
  onEdit,
  onDelete,
  deletingIdx,
  actions = {},
  meta = {},          
  onPageChange
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="p-2 border">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx} className="text-center">
                  {columns.map((col) => {
                    if (col.isAction) {
                      return (
                        <td key={col.key} className="p-2 border">
                          {col.key === 'operations' && (
                            <>
                              {onEdit && (
                                <button
                                  className="bg-green-500 cursor-pointer text-white px-2 py-1 rounded mr-2"
                                  onClick={() => onEdit(row)}
                                >
                                  <Pencil size={16} />
                                </button>
                              )}
                              {onDelete && (
                                <button
                                  key={idx}
                                  className="bg-red-500 cursor-pointer text-white px-2 py-1 rounded mr-2"
                                  onClick={() => onDelete(row, idx)}
                                >
                                  {deletingIdx === idx ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 size={16} />
                                  )}
                                </button>
                              )}
                            </>
                          )}

                          {actions[col.key]?.map((ActionBtn, i) => (
                            <span key={i} className="ml-1">
                              {ActionBtn(row)}
                            </span>
                          ))}
                        </td>
                      )
                    }

                    const value = col.key === 'id' ? idx + 1 : row[col.key]
                    return (
                      <td key={col.key} className="p-2 border">
                        {col.render ? col.render(value, row, idx) : value}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 border text-center" colSpan={columns.length}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={!meta?.hasPrevPage}
            className={`flex items-center px-3 py-1 border rounded ${
              !meta?.hasPrevPage
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onPageChange(meta.currentPage - 1)}
          >
            <ChevronLeft size={16} className="mr-1" /> Prev
          </button>

          <span className="text-sm">
            Page <b>{meta.currentPage}</b> of {meta.totalPages} | Total:{' '}
            {meta.totalRecords}
          </span>

          <button
          disabled={!meta?.hasNextPage}
            className={`flex items-center px-3 py-1 border rounded ${
              !meta?.hasNextPage
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-gray-100'
            }`}
            onClick={() => onPageChange(meta.currentPage + 1)}
          >
            Next <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
    </div>
  )
}
