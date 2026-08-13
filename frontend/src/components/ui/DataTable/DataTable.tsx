import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import styles from './DataTable.module.css';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  pageSize?: number;
  exportFilename?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchPlaceholder = 'Filter data...',
  pageSize = 10,
  exportFilename = 'traffic_data_export.csv',
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortColumn, sortAsc]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key?: keyof T) => {
    if (!key) return;
    if (sortColumn === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortColumn(key);
      setSortAsc(true);
    }
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;
    const headers = columns.map((c) => c.header).join(',');
    const rows = sortedData.map((row) =>
      columns.map((c) => (c.accessorKey ? `"${row[c.accessorKey]}"` : '""')).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.searchBox}>
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Button variant="secondary" size="sm" onClick={handleExportCSV}>
          <Download size={14} /> Export CSV
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={styles.th}
                  onClick={() => col.sortable !== false && handleSort(col.accessorKey)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {col.header}
                    {col.sortable !== false && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rIdx) => (
              <tr key={rIdx} className={styles.tr}>
                {columns.map((col, cIdx) => (
                  <td key={cIdx} className={styles.td}>
                    {col.cell ? col.cell(row) : col.accessorKey ? String(row[col.accessorKey] ?? '') : ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.pagination}>
        <span>
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, sortedData.length)} of {sortedData.length} entries
        </span>
        <div className={styles.paginationButtons}>
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft size={14} /> Prev
          </Button>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            Next <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
