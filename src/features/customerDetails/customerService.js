import { db } from '@/core/db';
import { buildCustomerSummaries } from './aggregate';
/** Reads all invoices, returns, and customers from directory, aggregating per customer. */
export async function loadCustomerSummaries(includeDirectory = false) {
  const [invoices, returns, directoryCustomers] = await Promise.all([
    db.getAllInvoices(),
    db.getAllReturns({ strict: true }),
    includeDirectory ? db.getAllCustomers().catch(() => []) : Promise.resolve([]),
  ]);
  const list = buildCustomerSummaries(invoices, returns, directoryCustomers || []);
  return list.sort((a, b) =>
    (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' }),
  );
}
