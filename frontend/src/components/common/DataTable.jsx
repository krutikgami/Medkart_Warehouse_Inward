import { Loader2, Pencil, Trash2 } from 'lucide-react'

export default function DataTable({
  title,
  columns = [],
  data = [],
  onEdit,
  onDelete,
  deletingIdx,
  actions = {},
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
                              {/*Default Edit/Delete Buttons*/}
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
                                  onClick={() => onDelete(row,idx)}
                                >
                                  {deletingIdx === idx ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 size={16} />}
                                </button>
                              )}
                            </>
                          )}

                          {/* Custom actions buttons like (View Items,PI,Grn etc..) */}
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
    </div>
  )
}
