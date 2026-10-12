import { AlertMessage } from "@/components/ui";
export function FormNotice({
  error,
  saved,
  deleted,
}: {
  error?: string;
  saved?: string;
  deleted?: string;
}) {
  if (error) {
    const message =
      error === "validation"
        ? "Check the required fields and date values."
        : error === "timezone"
        ? "Enter a valid IANA timezone, such as Asia/Colombo."
        : error === "delete"
        ? "Could not delete this record. Please try again."
        : "We couldn’t save this change. Please try again.";
    return <AlertMessage kind="error">{message}</AlertMessage>;
  }
  if (deleted) return <AlertMessage kind="success">Record deleted successfully.</AlertMessage>;
  if (saved) return <AlertMessage kind="success">Changes saved.</AlertMessage>;
  return null;
}
