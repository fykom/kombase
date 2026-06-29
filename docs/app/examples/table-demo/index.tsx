import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import {
  DataTable,
  DataTableAdvanceFilter,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  idIDTranslations,
  LongText,
  useDataTable,
} from 'kombase';
import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { BulkActions } from './bulk-actions';
import { callTypes, roles } from './data/data';
import { users } from './data/dummy';
import type { User } from './data/schema';
import { DataTableRowActions } from './row-actions';
import { UsersProvider } from './user-providers';

export default function TableDemo({
  initialAdvanceFilter = false,
  initialIndonesian = false,
}: {
  initialAdvanceFilter?: boolean;
  initialIndonesian?: boolean;
} = {}) {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const columns: ColumnDef<User>[] = [
    {
      cell: ({ row }) => (
        <Checkbox
          aria-label="Select row"
          checked={row.getIsSelected()}
          className="translate-y-0.5"
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableHiding: false,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          aria-label="Select all"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          className="translate-y-0.5"
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        />
      ),
      id: 'select',
    },
    {
      accessorFn: (row) => row.username,
      cell: ({ row }) => <LongText className="max-w-36 ps-3">{row.getValue('username')}</LongText>,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Username" />,
      id: 'username',
      meta: {
        label: 'Username',
      },
    },
    {
      cell: ({ row }) => {
        const { firstName, lastName } = row.original;
        const fullName = `${firstName} ${lastName}`;
        return <LongText className="max-w-36">{fullName}</LongText>;
      },
      header: ({ column }) => <DataTableColumnHeader column={column} label="Name" />,
      id: 'fullName',
    },
    {
      accessorFn: (row) => row.email,
      cell: ({ row }) => <div className="w-fit ps-2 text-nowrap">{row.getValue('email')}</div>,
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: true,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Email" />,
      id: 'email',
      meta: {
        label: 'Email',
        placeholder: 'Search email...',
        variant: 'text',
      },
    },
    {
      accessorFn: (row) => row.phoneNumber,
      cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Phone Number" />,
      id: 'phoneNumber',
      meta: {
        label: 'Phone Number',
      },
    },
    {
      accessorFn: (row) => row.status,
      cell: ({ row }) => {
        const { status } = row.original;
        const badgeColor = callTypes.get(status);
        return (
          <div className="flex space-x-2">
            <Badge className={cn('capitalize', badgeColor)} variant="outline">
              {row.getValue('status')}
            </Badge>
          </div>
        );
      },
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      header: ({ column }) => <DataTableColumnHeader column={column} label="Status" />,
      id: 'status',
      meta: {
        label: 'Status',
        options: [
          { label: 'PAID', value: 'PAID' },
          { label: 'PENDING', value: 'PENDING' },
          { label: 'FAILED', value: 'FAILED' },
        ],
        variant: 'multiSelect',
      },
    },
    {
      accessorFn: (row) => row.role,
      cell: ({ row }) => {
        const { role } = row.original;
        const userType = roles.find(({ value }) => value === role);

        if (!userType) {
          return null;
        }

        return (
          <div className="flex items-center gap-x-2">
            {userType.icon && <userType.icon className="text-muted-foreground" size={16} />}
            <span className="text-sm capitalize">{row.getValue('role')}</span>
          </div>
        );
      },
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      header: ({ column }) => <DataTableColumnHeader column={column} label="Role" />,
      id: 'role',
      meta: {
        label: 'Role',
        options: roles.map(({ label, value, icon }) => ({ icon, label, value })),
        variant: 'select',
      },
    },
    {
      accessorFn: (row) => row.createdAt,
      cell: ({ cell }) => dayjs(cell.getValue<string>()).format('dd LLL y'),
      enableColumnFilter: true,
      enableHiding: false,
      enableSorting: false,
      header: ({ column }) => <DataTableColumnHeader column={column} label="Created At" />,
      id: 'createdAt',
      meta: {
        label: 'Created At',
        presets: [
          {
            label: 'Today',
            value: {
              from: dayjs().startOf('day').toDate(),
              to: dayjs().endOf('day').toDate(),
            },
          },
          {
            label: 'This Week',
            value: {
              from: dayjs().startOf('week').toDate(),
              to: dayjs().endOf('week').toDate(),
            },
          },
          {
            label: 'Last 14 Days',
            value: () => ({
              from: dayjs().subtract(13, 'day').startOf('day').toDate(),
              to: dayjs().endOf('day').toDate(),
            }),
          },
        ],
        variant: 'dateRange',
      },
      size: 100,
    },
    {
      cell: DataTableRowActions,
      id: 'actions',
    },
  ];

  const [isAdvanceFilter, setIsAdvanceFilter] = useState(initialAdvanceFilter);
  const [useIndonesian, setUseIndonesian] = useState(initialIndonesian);

  const pageCount = Math.ceil(users.length / perPage);

  const { table } = useDataTable({
    columns,
    data: users as User[],
    getRowId: (row) => row.id,
    isAdvanceFilter,
    onPageChange: setPage,
    onPerPageChange: (newPerPage) => {
      setPerPage(newPerPage);
      setPage(1);
    },
    page,
    pageCount,
    perPage,
  });

  return (
    <UsersProvider>
      <div className="@7xl/content:mx-auto @7xl/content:w-full @7xl/content:max-w-7xl  flex grow flex-col overflow-hidden px-4 py-6  flex-1  gap-4 sm:gap-6">
        <div className="flex flex-wrap items-center gap-4 bg-muted/40 p-3 rounded-lg border border-border">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={isAdvanceFilter}
              id="toggle-advanced-filter"
              onCheckedChange={(checked) => setIsAdvanceFilter(!!checked)}
            />
            <label className="text-xs font-medium cursor-pointer" htmlFor="toggle-advanced-filter">
              Use Advanced Filter
            </label>
          </div>
          {isAdvanceFilter && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={useIndonesian}
                id="toggle-indonesian"
                onCheckedChange={(checked) => setUseIndonesian(!!checked)}
              />
              <label className="text-xs font-medium cursor-pointer" htmlFor="toggle-indonesian">
                Translate to Bahasa Indonesia
              </label>
            </div>
          )}
        </div>
        <DataTable table={table}>
          <DataTableToolbar
            actions={
              <Button size="icon" variant="outline">
                <RefreshCw />
              </Button>
            }
            hideFilter={isAdvanceFilter}
            table={table}
            viewOptions={false}
          >
            {isAdvanceFilter && (
              <DataTableAdvanceFilter
                table={table}
                translations={useIndonesian ? idIDTranslations : undefined}
              />
            )}
          </DataTableToolbar>
        </DataTable>
        <DataTablePagination className="mt-auto" table={table} />
        <BulkActions table={table} />
      </div>
    </UsersProvider>
  );
}
