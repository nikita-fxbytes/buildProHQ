import Paper from "@mui/material/Paper";

export type AppTableShellProps = {
  children: React.ReactNode;
};

export function AppTableShell({ children }: AppTableShellProps) {
  return (
    <Paper className="table-card" elevation={0}>
      {children}
    </Paper>
  );
}
